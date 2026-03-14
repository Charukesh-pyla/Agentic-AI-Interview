from typing import Dict, Any, Optional
from pydantic import BaseModel

class GraphState(BaseModel):
    interview_config: Optional[Dict[str, Any]] = None
    resume_text: Optional[str] = None
    extracted_links: Optional[Dict[str, str]] = None
    resume_insights: Optional[Dict[str, Any]] = None
    coding_profile: Optional[Dict[str, Any]] = None
    domain_strengths: Optional[Dict[str, Any]] = None
    selected_topics: Optional[Dict[str, Any]] = None
    questions: Optional[Dict[str, Any]] = None
    validation_result: Optional[Dict[str, Any]] = None
    feedback: Optional[Dict[str, Any]] = None
    resume_path: Optional[str] = None
