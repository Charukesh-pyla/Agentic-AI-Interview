import os
import uuid
from typing import Dict, Any, List, Optional
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil

from utils.input_loader import load_interview_input
from graph.state import GraphState
from agents.resume_agent import resume_understanding_agent
from tools.coding_profile_analyzer import coding_profile_analyzer_tool
from agents.domain_reasoning_agent import domain_strength_reasoning_agent
from agents.hitl_topic_selector import hitl_topic_selector_agent
from agents.question_generator_agent import question_generator_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for session states (for development/MVP)
sessions: Dict[str, GraphState] = {}

class GenerateRequest(BaseModel):
    session_id: str
    domains: List[str]
    difficulty: str
    question_count: Dict[str, int]
    recruiter_hint: Optional[str] = None
    generation_mode: str = "normal"
    strategy: str = "Balanced Interview"
    selected_topics: Optional[Dict[str, List[str]]] = None

@app.post("/api/analyze-resume")
def analyze_resume(file: UploadFile = File(...)):
    # Save uploaded file to a temporary location
    temp_dir = "temp_resumes"
    os.makedirs(temp_dir, exist_ok=True)
    
    session_id = str(uuid.uuid4())
    file_path = os.path.join(temp_dir, f"{session_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Dummy config to pass the initial state validation
        dummy_config = {
            "domains": ["DSA", "CSF"],
            "difficulty": "Medium",
            "question_count": {"DSA": 1, "CSF": 1}
        }
        
        # Run Modules 1 to 4 to analyze the resume
        inputs = load_interview_input(dummy_config, file_path)
        state = GraphState(**inputs)
        
        state = resume_understanding_agent(state)
        state = coding_profile_analyzer_tool(state)
        state = domain_strength_reasoning_agent(state)
        
        # Store state in memory
        sessions[session_id] = state
        
        # Extract relevant info for the frontend
        insights = state.resume_insights or {}
        coding_profile = state.coding_profile or {}
        domain_strengths = state.domain_strengths or {}
        
        # Build topic summary from domain strengths
        topic_summary = {}
        for domain, topics in domain_strengths.items():
            strong = []
            medium = []
            weak = []
            if isinstance(topics, dict):
                for topic, level in topics.items():
                    if level == "Strong":
                        strong.append(topic)
                    elif level == "Medium":
                        medium.append(topic)
                    else:
                        weak.append(topic)
            topic_summary[domain] = {
                "strong": strong,
                "medium": medium,
                "weak": weak
            }

        # Fallback if DSA is empty (e.g. scraper failed or didn't run)
        if not topic_summary.get("DSA") or (not topic_summary["DSA"]["strong"] and not topic_summary["DSA"]["medium"] and not topic_summary["DSA"]["weak"]):
            topic_summary["DSA"] = {
                "strong": ["Array"],
                "medium": ["Hash Table", "Math", "String", "Sorting"],
                "weak": ["Dynamic Programming", "Divide and Conquer"]
            }

        if not topic_summary.get("CSF") or (not topic_summary["CSF"]["strong"] and not topic_summary["CSF"]["medium"] and not topic_summary["CSF"]["weak"]):
            topic_summary["CSF"] = {
                "strong": [],
                "medium": ["OS", "DBMS"],
                "weak": []
            }
        
        # Format the response for the dashboard
        return {
            "session_id": session_id,
            "profile": {
                "summary": state.resume_text or "Candidate profile analyzed successfully.",
                "skills": insights.get("skills_detected", []),
                "experience": insights.get("experience_years", 0)
            },
            "leetcode_analysis": {
                "stats": [
                    {"name": "Easy", "value": coding_profile.get("easy_solved", 0) if coding_profile else 120},
                    {"name": "Medium", "value": coding_profile.get("medium_solved", 0) if coding_profile else 80},
                    {"name": "Hard", "value": coding_profile.get("hard_solved", 0) if coding_profile else 20}
                ],
                "strong": topic_summary.get("DSA", {}).get("strong", []),
                "medium": topic_summary.get("DSA", {}).get("medium", []),
                "weak": topic_summary.get("DSA", {}).get("weak", [])
            },
            "topic_summary": topic_summary
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-questions")
async def generate_questions(req: GenerateRequest):
    if req.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found. Please upload the resume again.")
        
    state = sessions[req.session_id]
    
    # Update state with the new configuration from the frontend
    state.interview_config = {
        "domains": req.domains,
        "difficulty": req.difficulty,
        "question_count": req.question_count,
        "strategy": req.strategy,
        "selected_topics": req.selected_topics
    }
    
    state.generation_mode = req.generation_mode
    state.recruiter_hint = req.recruiter_hint
    
    try:
        # Run Topic Selection and Question Generation (Modules 5 & 6)
        state = hitl_topic_selector_agent(state)
        state = question_generator_agent(state)
        
        # Save updated state
        sessions[req.session_id] = state
        
        # Format questions for the frontend
        formatted_questions = []
        questions_dict = state.questions or {}
        
        for domain, q_list in questions_dict.items():
            if isinstance(q_list, dict) and "error" in q_list:
                raise Exception(f"Generation error in {domain}: {q_list['error']}")
            if not isinstance(q_list, list):
                continue
            for idx, q in enumerate(q_list):
                formatted_questions.append({
                    "id": f"{domain}-{idx}",
                    "title": q.get("title", f"{domain} Question {idx+1}"),
                    "topic": domain,
                    "difficulty": req.difficulty,
                    "problem": q.get("problem_statement", "") or q.get("question", ""),
                    "constraints": q.get("constraints", ""),
                    "example": q.get("examples", ""),
                    "edge_cases": q.get("edge_cases", ""),
                    "expected_answer_points": q.get("expected_answer_points", ""),
                    "follow_up_questions": q.get("follow_up_questions", "")
                })
                
        return {
            "questions": formatted_questions,
            "topic_summary": state.topic_summary or {}
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
