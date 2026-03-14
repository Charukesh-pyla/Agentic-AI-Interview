from utils.interview_config import InterviewConfig
# from tools.resume_text_extractor import extract_text_from_resume
from tools.resume_text_extractor import extract_text_from_resume

def load_interview_input(config_dict: dict, resume_path: str):
    interview_config = InterviewConfig(**config_dict)
    resume_text = extract_text_from_resume(resume_path)

    return {
        "interview_config": interview_config.dict(),
        "resume_text": resume_text,
        "resume_path": resume_path
    }
