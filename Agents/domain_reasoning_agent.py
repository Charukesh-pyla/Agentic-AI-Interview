def domain_strength_reasoning_agent(state):

    resume_insights = state.resume_insights
    coding_profile = state.coding_profile
    interview_config = state.interview_config

    domain_strengths = {}

    # ---------------- DSA Reasoning ----------------

    if "DSA" in interview_config["domains"]:

        dsa_topics = {}

        if coding_profile and coding_profile.get("skills"):

            for topic, count in coding_profile["skills"].items():

                if count > 100:
                    level = "Strong"

                elif count > 40:
                    level = "Medium"

                else:
                    level = "Weak"

                dsa_topics[topic] = level

        if not dsa_topics:
            dsa_topics = {
                "Array": "Strong",
                "Hash Table": "Medium",
                "Math": "Medium",
                "String": "Medium",
                "Sorting": "Medium",
                "Dynamic Programming": "Weak",
                "Divide and Conquer": "Weak"
            }

        domain_strengths["DSA"] = dsa_topics

    # ---------------- CSF Reasoning ----------------

    if "CSF" in interview_config["domains"]:

        csf_topics = {}

        for topic in resume_insights.get("csf_exposure", []):

            csf_topics[topic] = "Medium"

        if not csf_topics:
            csf_topics = {
                "OS": "Medium",
                "DBMS": "Medium"
            }

        domain_strengths["CSF"] = csf_topics

    state.domain_strengths = domain_strengths

    return state