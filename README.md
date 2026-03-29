# 🚀 AI-Powered Interview Question Generator

An intelligent system that generates personalized interview questions based on a candidate's resume and coding profile.

---

## 📌 Overview

This project simulates how a recruiter designs an interview by analyzing a candidate's strengths and weaknesses, then generating targeted questions across:

- **Data Structures & Algorithms (DSA)**
- **Computer Science Fundamentals (CSF)**

---

## ✨ Features

- 📄 Resume-based analysis
- 📊 Topic strength classification (**Strong / Medium / Weak**)
- 🎯 Dynamic question generation based on selected topics
- 🧠 LLM-powered (Gemini API) question creation
- ✅ Schema-based validation of generated questions
- ⚙️ Recruiter-controlled configuration (difficulty, topics, count)
- 📈 Planned UI with analytics dashboard and workflow

---

## 🏗️ Architecture
```
Resume Input
   ↓
Resume Analyzer
   ↓
Topic Classification (DSA + CSF)
   ↓
Interview Config Selection
   ↓
Question Generator (LLM)
   ↓
Validation Layer
   ↓
Final Questions Output
```

---

## 🧠 How It Works

1. Upload candidate resume
2. Extract skills and topics
3. Classify strengths (Strong / Medium / Weak)
4. Recruiter selects:
   - Topics
   - Difficulty
   - Number of questions
5. System generates structured interview questions
6. Validation layer filters incorrect outputs

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python |
| LLM | Gemini API |
| Framework (planned) | FastAPI |
| Frontend (planned) | React + Tailwind CSS |
| Data Processing | JSON-based pipelines |

---

## 📂 Project Structure
```
├── agents/
│   ├── resume_analyzer.py
│   ├── question_generator.py
│   ├── validation_agent.py
│
├── utils/
│   ├── parser.py
│   ├── helpers.py
│
├── main.py
├── .env
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/ai-interview-generator.git
cd ai-interview-generator
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Add API Key

Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Run the project
```bash
python main.py
```

---

## 📸 Sample Output

- **DSA questions** — LeetCode-style with constraints & examples
- **CSF questions** — Conceptual with expected answer points
- **Topic-focused** — Tailored generation per selected domain

---

## 🚧 Future Improvements

- 🌐 Full frontend dashboard (React UI)
- 📊 Visual analytics (LeetCode-style charts)
- 🧾 Answer evaluation + feedback system
- 🔁 Auto-regeneration for invalid questions
- 📡 API deployment (FastAPI)

---

## 🎯 Key Highlights

- Modular agent-based design
- Real-world interview simulation workflow
- Strong focus on structured output + validation
- Supports multi-domain question generation

---

## 🤝 Contributing

Feel free to fork and improve the project! Pull requests are welcome.

---

## ⭐ Like this project?

Give it a star ⭐ on GitHub — it really helps!
