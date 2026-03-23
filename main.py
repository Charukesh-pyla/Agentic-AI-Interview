from utils.input_loader import load_interview_input
from graph.state import GraphState
from agents.resume_agent import resume_understanding_agent
from tools.coding_profile_analyzer import coding_profile_analyzer_tool
from agents.domain_reasoning_agent import domain_strength_reasoning_agent
from agents.hitl_topic_selector import hitl_topic_selector_agent
from agents.question_generator_agent import question_generator_agent
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
    # MODULE 5
    state = hitl_topic_selector_agent(state)
    print("\nCURRENT STATE:\n")
    print(state.model_dump())

    state.generation_mode = "normal"   # options: normal, expand, similar
    state.recruiter_hint = None        # example: "array question where sum becomes zero"

    state = question_generator_agent(state)

    print("\nQUESTIONS:\n")
    print(state.questions)


if __name__ == "__main__":
    main()