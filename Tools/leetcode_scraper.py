from playwright.sync_api import sync_playwright
import re


def extract_leetcode_profile(url):

    result = {
        "leetcode_profile": True,
        "difficulty": {},
        "skills": {},
        "languages": []
    }

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=False, slow_mo=50)
        page = browser.new_page()

        page.goto(url, timeout=60000)

        # page.wait_for_load_state("networkidle")

        # page.wait_for_timeout(4000)

        # page.mouse.wheel(0, 3000)

        # page.wait_for_timeout(2000)

        # wait for page to load
        page.wait_for_timeout(4000)

        page_text = page.inner_text("body")

        # -------- Difficulty --------
        difficulty_texts = page.locator(
            "text=/Easy\\s*\\d+|Med\\.\\s*\\d+|Hard\\s*\\d+/"
        ).all_text_contents()

        for text in difficulty_texts:
            match = re.search(r"(Easy|Med\.|Hard)\s*(\d+)", text)
            if match:
                key = match.group(1).replace("Med.", "medium").lower()
                result["difficulty"][key] = int(match.group(2))

        # -------- Skills --------
        skill_pattern = re.findall(
            r"(Array|Two Pointers|Linked List|Hash Table|String|Binary Search|Math|Dynamic Programming|Divide and Conquer|Trie|Graph|Greedy|Heap|Stack|Queue|Matrix|Sorting|Simulation)\s*[×x]\s*(\d+)",
            page_text
        )

        for topic, count in skill_pattern:
            result["skills"][topic] = int(count)

        # -------- Languages --------
        for lang in ["Python", "Java", "C++"]:
            if lang in page_text:
                result["languages"].append(lang)

        browser.close()

    return result
def analyze_coding_profile(url):

    profile = extract_leetcode_profile(url)

    difficulty = profile.get("difficulty", {})
    total = sum(difficulty.values())

    if total > 400:
        strength = "High"
    elif total > 200:
        strength = "Medium"
    else:
        strength = "Beginner"

    profile["dsa_strength"] = strength

    return profile