from tools.resume_links_extractor import extract_links_from_pdf


def resume_understanding_agent(state):
    """
    Agent responsibilities:
    1. Use tool to extract hyperlinks
    2. Categorize links
    3. Analyze resume text for insights
    """

    resume_text = state.resume_text
    resume_path = state.resume_path

    # -------- Call Tool --------
    links = extract_links_from_pdf(resume_path)

    # -------- Categorize Links --------
    categorized = {
        "LeetCode": [],
        "GitHub": [],
        "LinkedIn": [],
        "Other": []
    }

    for link in links:
        if "leetcode.com" in link:
            categorized["LeetCode"].append(link)
        elif "github.com" in link:
            categorized["GitHub"].append(link)
        elif "linkedin.com" in link:
            categorized["LinkedIn"].append(link)
        else:
            categorized["Other"].append(link)

    # -------- Resume Reasoning --------
    resume_lower = resume_text.lower()

    resume_insights = {
        "skills_detected": [],
        "dsa_exposure": [],
        "csf_exposure": []
    }

    if "python" in resume_lower:
        resume_insights["skills_detected"].append("Python")

    if "java" in resume_lower:
        resume_insights["skills_detected"].append("Java")

    if "data structures" in resume_lower:
        resume_insights["dsa_exposure"].append("General DSA")

    if "graph" in resume_lower:
        resume_insights["dsa_exposure"].append("Graphs")

    if "operating system" in resume_lower or "os" in resume_lower:
        resume_insights["csf_exposure"].append("OS")

    if "dbms" in resume_lower:
        resume_insights["csf_exposure"].append("DBMS")

    # -------- Store Only Important Links --------
    extracted_links = {
        "leetcode": categorized["LeetCode"][0] if categorized["LeetCode"] else None,
        "github": categorized["GitHub"][0] if categorized["GitHub"] else None,
        "linkedin": categorized["LinkedIn"][0] if categorized["LinkedIn"] else None
    }

    # -------- Update State --------
    state.extracted_links = extracted_links
    state.resume_insights = resume_insights

    return state