from utils.input_loader import load_interview_input
from graph.state import GraphState
from agents.resume_agent import resume_understanding_agent
from tools.coding_profile_analyzer import coding_profile_analyzer_tool
from agents.domain_reasoning_agent import domain_strength_reasoning_agent
def main():

    config_dict = {
        "domains": ["DSA", "CSF"],
        "difficulty": "Medium",
        "question_count": {
            "DSA": 3,
            "CSF": 2
        }
    }

    resume_path = "Preethika-Chowdary-Nekkanti-Resume.pdf"

    # MODULE 1
    inputs = load_interview_input(config_dict, resume_path)

    state = GraphState(**inputs)

    # MODULE 2
    state = resume_understanding_agent(state)
    # MODULE 3
    state = coding_profile_analyzer_tool(state)
    # MODULE 4
    state = domain_strength_reasoning_agent(state)

    print("\nCURRENT STATE:\n")
    print(state.model_dump())


if __name__ == "__main__":
    main()