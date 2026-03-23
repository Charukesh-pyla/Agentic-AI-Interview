import json
import os
import re
from typing import Any, Dict, List
from dotenv import load_dotenv
from google import genai
from google.genai.errors import ClientError


load_dotenv()


def _extract_json(text: str) -> Dict[str, Any]:
    text = text.strip()

    if text.startswith("```"):
        text = re.sub(r"^```json\s*|^```\s*|```$", "", text, flags=re.MULTILINE).strip()

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1:
        raise ValueError("No valid JSON object found in model response.")

    return json.loads(text[start:end + 1])


def _build_prompt(
    domain: str,
    topics: List[str],
    difficulty: str,
    question_count: int,
    recruiter_hint: str | None = None,
    mode: str = "normal"
) -> str:
    hint_text = recruiter_hint if recruiter_hint else "None"
    topics_text = ", ".join(topics) if topics else "None"

    if domain == "DSA":
        return f"""
You are an expert technical interviewer.

Generate {question_count} high-quality DSA interview question(s) in STRICT JSON ONLY.

Mode: {mode}
Domain: {domain}
Topics: {topics_text}
Difficulty: {difficulty}
Recruiter Hint: {hint_text}

Requirements:
1. Questions must be logically correct and interview-safe.
2. Use LeetCode-style formatting.
3. Include a clear problem statement.
4. Include valid constraints.
5. Include at least 1 correct example with input, output, and explanation.
6. Include important edge cases.
7. Do NOT include solutions yet.
8. If recruiter hint is partial, expand it into a full polished problem.
9. If mode is "similar", generate a similar question, not the exact same one.
10. Return STRICT JSON only. No markdown. No explanation outside JSON.

Return format:
{{
  "questions": [
    {{
      "title": "",
      "topic": "",
      "difficulty": "{difficulty}",
      "problem_statement": "",
      "constraints": ["", ""],
      "examples": [
        {{
          "input": "",
          "output": "",
          "explanation": ""
        }}
      ],
      "edge_cases": ["", ""]
    }}
  ]
}}
""".strip()

    elif domain == "CSF":
        return f"""
You are an expert technical interviewer.

Generate {question_count} high-quality CSF interview question(s) in STRICT JSON ONLY.

Mode: {mode}
Domain: {domain}
Topics: {topics_text}
Difficulty: {difficulty}
Recruiter Hint: {hint_text}

Requirements:
1. Generate Computer Science Fundamentals interview questions.
2. Topics may include OS, DBMS, CN, OOP and similar fundamentals.
3. Questions must be logically correct and interview-safe.
4. Questions should be theory-based, scenario-based, or concept-application based.
5. Include expected answer points for interviewer reference.
6. Include 2 to 3 follow-up questions.
7. If recruiter hint is partial, expand it into a full polished question.
8. If mode is "similar", generate a similar question, not the exact same one.
9. Return STRICT JSON only. No markdown. No explanation outside JSON.

Return format:
{{
  "questions": [
    {{
      "title": "",
      "topic": "",
      "difficulty": "{difficulty}",
      "question": "",
      "expected_answer_points": ["", ""],
      "follow_up_questions": ["", ""]
    }}
  ]
}}
""".strip()

    else:
        return f"""
You are an expert technical interviewer.

Generate {question_count} high-quality interview question(s) in STRICT JSON ONLY.

Mode: {mode}
Domain: {domain}
Topics: {topics_text}
Difficulty: {difficulty}
Recruiter Hint: {hint_text}

Return STRICT JSON only.

Return format:
{{
  "questions": [
    {{
      "title": "",
      "topic": "",
      "difficulty": "{difficulty}",
      "question": ""
    }}
  ]
}}
""".strip()


def _validate_question_structure(question: Dict[str, Any], domain: str) -> bool:
    if domain == "DSA":
        required_fields = [
            "title",
            "topic",
            "difficulty",
            "problem_statement",
            "constraints",
            "examples",
            "edge_cases",
        ]

        for field in required_fields:
            if field not in question:
                return False

        if not isinstance(question["constraints"], list) or not question["constraints"]:
            return False

        if not isinstance(question["examples"], list) or not question["examples"]:
            return False

        if not isinstance(question["edge_cases"], list) or not question["edge_cases"]:
            return False

        return True

    elif domain == "CSF":
        required_fields = [
            "title",
            "topic",
            "difficulty",
            "question",
            "expected_answer_points",
            "follow_up_questions",
        ]

        for field in required_fields:
            if field not in question:
                return False

        if not isinstance(question["expected_answer_points"], list) or not question["expected_answer_points"]:
            return False

        if not isinstance(question["follow_up_questions"], list) or not question["follow_up_questions"]:
            return False

        return True

    return False


def question_generator_agent(state):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")

    client = genai.Client(api_key=api_key)

    interview_config = state.interview_config
    selected_topics = state.selected_topics
    recruiter_hint = getattr(state, "recruiter_hint", None)
    generation_mode = getattr(state, "generation_mode", "normal")

    generated_questions = {}

    for domain, topics in selected_topics.items():
        if not topics:
            generated_questions[domain] = []
            continue

        difficulty = interview_config["difficulty"]
        question_count = interview_config["question_count"].get(domain, 1)

        prompt = _build_prompt(
            domain=domain,
            topics=topics,
            difficulty=difficulty,
            question_count=question_count,
            recruiter_hint=recruiter_hint,
            mode=generation_mode
        )

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            parsed = _extract_json(response.text)

        except ClientError as e:
            generated_questions[domain] = {
                "error": f"Gemini API quota exceeded or request failed: {str(e)}"
            }
            continue

        except Exception as e:
            generated_questions[domain] = {
                "error": f"Unexpected error: {str(e)}"
            }
            continue

        questions = parsed.get("questions", [])

        valid_questions = []
        for q in questions:
            if _validate_question_structure(q, domain):
                valid_questions.append(q)

        print(f"\nRAW PARSED OUTPUT FOR {domain}:\n{parsed}")
        generated_questions[domain] = valid_questions

    state.questions = generated_questions
    return state