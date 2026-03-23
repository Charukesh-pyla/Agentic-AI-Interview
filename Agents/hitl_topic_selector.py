def hitl_topic_selector_agent(state):

    domain_strengths = state.domain_strengths

    topic_summary = {}
    selected_topics = {}

    # ---------------------------
    # Build topic summary
    # ---------------------------
    for domain, topics in domain_strengths.items():

        strong = []
        medium = []
        weak = []

        for topic, level in topics.items():

            if level == "Strong":
                strong.append(topic)

            elif level == "Medium":
                medium.append(topic)

            else:
                weak.append(topic)

        topic_summary[domain] = {
            "strong": strong,
            "medium": medium,
            "weak": weak
        }

    # Save summary for frontend / UI
    state.topic_summary = topic_summary

    # ---------------------------
    # CLI interaction (for now)
    # ---------------------------
    print("\nCandidate Topic Summary\n")

    for domain, summary in topic_summary.items():

        print(f"\n{domain}")
        print("Strong:", summary["strong"])
        print("Medium:", summary["medium"])
        print("Weak:", summary["weak"])

    print("\nSelect Interview Strategy:")
    print("1 → Focus on Strong topics")
    print("2 → Balanced interview (default)")
    print("3 → Challenge Weak topics")
    print("4 → Manual topic selection")

    choice = input("\nEnter choice: ").strip()

    # Default fallback
    if choice not in ["1", "2", "3", "4"]:
        choice = "2"

    # ---------------------------
    # Topic selection logic
    # ---------------------------
    for domain, summary in topic_summary.items():

        strong = summary["strong"]
        medium = summary["medium"]
        weak = summary["weak"]

        if choice == "1":
            selected = strong

        elif choice == "2":
            selected = strong[:1] + medium[:1]

        elif choice == "3":
            selected = weak

        else:
            manual = input(
                f"\nEnter topics for {domain} separated by comma: "
            ).strip()

            selected = [t.strip() for t in manual.split(",") if t.strip()]

        selected_topics[domain] = selected

    state.selected_topics = selected_topics

    return state