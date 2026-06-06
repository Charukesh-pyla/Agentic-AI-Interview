from tools.leetcode_scraper import analyze_coding_profile


def coding_profile_analyzer_tool(state):

    leetcode_url = state.extracted_links.get("leetcode")

    if not leetcode_url:
        state.coding_profile = None
        return state

    try:
        profile_data = analyze_coding_profile(leetcode_url)
    except Exception as e:
        print("LeetCode scraping failed:", e)
        profile_data = None

    state.coding_profile = profile_data

    return state