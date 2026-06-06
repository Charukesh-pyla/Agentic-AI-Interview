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

    import re
    common_skills = [
        "Python", "Java", "C#", "Rust", "JavaScript", "TypeScript",
        "React", "Next.js", "Angular", "Vue", "Node.js", "Express", "FastAPI", "Flask", "Django",
        "MongoDB", "SQL", "PostgreSQL", "MySQL", "SQLite", "Redis", "Tailwind", "Bootstrap",
        "HTML", "CSS", "Git", "GitHub", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "OpenAI", "GPT",
        "JWT", "GraphQL"
    ]

    for skill in common_skills:
        if skill.lower() in resume_lower:
            resume_insights["skills_detected"].append(skill)

    if "c++" in resume_lower:
        resume_insights["skills_detected"].append("C++")
    if re.search(r"\bgo\b", resume_lower):
        resume_insights["skills_detected"].append("Go")
    if re.search(r"\bc\b", resume_lower) and not "c++" in resume_lower:
        resume_insights["skills_detected"].append("C")

    # DSA Exposure
    dsa_keywords = {
        "General DSA": ["data structures", "algorithms"],
        "Graphs": ["graph", "tree"],
        "Arrays & Strings": ["array", "string"]
    }
    for label, keywords in dsa_keywords.items():
        if any(kw in resume_lower for kw in keywords):
            resume_insights["dsa_exposure"].append(label)

    # CSF Exposure
    csf_keywords = {
        "OS": ["operating system", "os"],
        "DBMS": ["dbms", "database", "sql", "mongodb"],
        "CN": ["computer network", "cn"],
        "OOPs": ["oops", "object oriented"]
    }
    for label, keywords in csf_keywords.items():
        if any(kw in resume_lower for kw in keywords):
            resume_insights["csf_exposure"].append(label)

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