from typing import Dict, List, Literal
from pydantic import BaseModel, Field, validator

Difficulty = Literal["Easy", "Medium", "Hard"]

class InterviewConfig(BaseModel):
    domains: List[str] = Field(..., example=["DSA", "CSF"])
    difficulty: Difficulty = Field(..., example="Medium")
    question_count: Dict[str, int] = Field(
        ..., example={"DSA": 3, "CSF": 2}
    )

    @validator("question_count")
    def validate_counts(cls, v):
        for domain, count in v.items():
            if count <= 0:
                raise ValueError(f"Question count must be > 0 for {domain}")
        return v
