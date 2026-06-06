"use client";
import { useState, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

export default function Dashboard() {
  const [selectedStrategy, setSelectedStrategy] = useState("Balanced Interview");
  
  // State for API integration
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [candidateProfile, setCandidateProfile] = useState<{summary: string, skills: string[]}>({
    summary: "Upload a candidate's resume to see the full extracted details and profile summary here.",
    skills: []
  });
  
  const [leetcodeData, setLeetcodeData] = useState<{name: string, value: number}[]>([
    { name: "Easy", value: 0 },
    { name: "Medium", value: 0 },
    { name: "Hard", value: 0 },
  ]);
  
  const [leetcodeInsights, setLeetcodeInsights] = useState<{strong: string[], medium: string[], weak: string[]}>({
    strong: [],
    medium: [],
    weak: []
  });

  const [topicSummary, setTopicSummary] = useState<any>({
    DSA: {
      strong: [],
      medium: [],
      weak: []
    },
    CSF: {
      strong: [],
      medium: [],
      weak: []
    }
  });

  const [manualSelectedTopics, setManualSelectedTopics] = useState<string[]>([]);

  const getStrategyTopics = (strategy: string) => {
    if (strategy === "Focus on Strong Topics") {
      const strongDSA = topicSummary.DSA?.strong || [];
      const strongCSF = topicSummary.CSF?.strong || [];
      return [...strongDSA, ...strongCSF];
    }
    if (strategy === "Challenge Weak Topics") {
      const weakDSA = topicSummary.DSA?.weak || [];
      const weakCSF = topicSummary.CSF?.weak || [];
      return [...weakDSA, ...weakCSF];
    }
    if (strategy === "Balanced Interview") {
      const strongDSA = topicSummary.DSA?.strong || [];
      const mediumDSA = topicSummary.DSA?.medium || [];
      const strongCSF = topicSummary.CSF?.strong || [];
      const mediumCSF = topicSummary.CSF?.medium || [];
      return [
        ...strongDSA.slice(0, 1), 
        ...mediumDSA.slice(0, 2), 
        ...strongCSF.slice(0, 1), 
        ...mediumCSF.slice(0, 1)
      ].filter(Boolean);
    }
    if (strategy === "Manual Topic Selection") {
      return manualSelectedTopics;
    }
    return [];
  };

  const handleToggleManualTopic = (topic: string) => {
    setManualSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };

  const [difficulty, setDifficulty] = useState("Medium");
  const [dsaCount, setDsaCount] = useState("3");
  const [csfCount, setCsfCount] = useState("2");
  const [recruiterHint, setRecruiterHint] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/analyze-resume", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Failed to analyze resume");
      
      const data = await res.json();
      setSessionId(data.session_id);
      
      if (data.profile) {
        setCandidateProfile({
          summary: data.profile.summary,
          skills: data.profile.skills || [],
        });
      }
      
      if (data.leetcode_analysis) {
        setLeetcodeData(data.leetcode_analysis.stats);
        setLeetcodeInsights({
          strong: data.leetcode_analysis.strong || [],
          medium: data.leetcode_analysis.medium || [],
          weak: data.leetcode_analysis.weak || []
        });
      }
      
      if (data.topic_summary) {
        setTopicSummary(data.topic_summary);
        // Clear previous manual selections
        setManualSelectedTopics([]);
      }
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume. Please ensure the backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!sessionId) {
      alert("Please upload a resume first to generate questions.");
      return;
    }

    if (selectedStrategy === "Manual Topic Selection" && manualSelectedTopics.length === 0) {
      alert("Please select at least one topic for Manual Topic Selection.");
      return;
    }

    setIsGenerating(true);
    
    // Prepare domains based on strategy
    let domains = ["DSA", "CSF"];

    // Partition manually selected topics by domain if manual strategy is chosen
    let selectedTopicsPayload = null;
    if (selectedStrategy === "Manual Topic Selection") {
      const dsaSelected = manualSelectedTopics.filter(t => 
        (topicSummary.DSA?.strong || []).includes(t) ||
        (topicSummary.DSA?.medium || []).includes(t) ||
        (topicSummary.DSA?.weak || []).includes(t)
      );
      const csfSelected = manualSelectedTopics.filter(t => 
        (topicSummary.CSF?.strong || []).includes(t) ||
        (topicSummary.CSF?.medium || []).includes(t) ||
        (topicSummary.CSF?.weak || []).includes(t)
      );
      selectedTopicsPayload = {
        DSA: dsaSelected,
        CSF: csfSelected
      };
    }

    try {
      const res = await fetch("http://localhost:8000/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          domains: domains,
          difficulty: difficulty,
          question_count: {
            "DSA": parseInt(dsaCount) || 3,
            "CSF": parseInt(csfCount) || 2
          },
          recruiter_hint: recruiterHint,
          strategy: selectedStrategy,
          generation_mode: "normal",
          selected_topics: selectedTopicsPayload
        }),
      });
      
      if (!res.ok) throw new Error("Failed to generate questions");
      
      const data = await res.json();
      setGeneratedQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
      alert("Error generating questions.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="w-64 bg-[#0a0a0f] border-r border-gray-800 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8">IntervAI</h2>
        <p className="text-xs text-gray-500 mb-4">MAIN MENU</p>
        <nav className="space-y-2">
          {["Dashboard", "Candidates", "Question Generator", "Insights", "Settings"].map((item, i) => (
            <div
              key={i}
              className={`px-4 py-3 rounded-lg cursor-pointer transition ${i === 0 ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Candidate Summary */}
        <div className="mt-10 grid md:grid-cols-1 gap-6">
          <div className="mt-8 p-6 rounded-xl bg-white/5 border border-gray-800 flex flex-col md:flex-row gap-4 items-start">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Candidate Profile</h2>
              <p className="text-gray-400 leading-relaxed text-sm max-h-60 overflow-y-auto whitespace-pre-line p-3 bg-black/40 rounded-lg border border-gray-800 scrollbar-thin">
                {candidateProfile.summary}
              </p>
              <div className="mt-4">
                <p className="text-lg font-semibold mb-2">Skills Detected</p>
                <div className="flex flex-wrap gap-2">
                  {candidateProfile.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 text-xs rounded-full bg-purple-600/20 border border-purple-500 text-purple-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Selection */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Select Interview Strategy</h2>
          <div className="space-y-3">
            {["Focus on Strong Topics", "Balanced Interview", "Challenge Weak Topics", "Manual Topic Selection"].map((strategy, i) => (
              <div key={i}>
                <button
                  onClick={() => setSelectedStrategy(strategy)}
                  className={`w-full text-left px-5 py-4 rounded-xl transition border ${
                    selectedStrategy === strategy ? "bg-purple-600/20 border-purple-500" : "bg-white/5 border-gray-800 hover:border-purple-500 hover:bg-white/10"
                  }`}
                >
                  <div className="font-medium">{i + 1}. {strategy}</div>
                </button>
                {selectedStrategy === strategy && strategy !== "Manual Topic Selection" && (
                  <div className="mt-3 p-4 rounded-xl bg-white/5 border border-gray-800">
                    <p className="text-xs text-gray-400 mb-2">Auto-selected topics</p>
                    <div className="flex flex-wrap gap-2 animate-fade-in">
                      {getStrategyTopics(strategy).length > 0 ? (
                        getStrategyTopics(strategy).map((topic, idx) => (
                          <span key={idx} className="px-3 py-1 text-xs rounded-full bg-purple-600/20 border border-purple-500 mr-2 mb-2 inline-block">
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No topics match this strategy.</span>
                      )}
                    </div>
                  </div>
                )}
                {selectedStrategy === "Manual Topic Selection" && strategy === selectedStrategy && (
                  <div className="mt-3 p-4 rounded-xl bg-white/5 border border-gray-800">
                    <p className="text-xs text-gray-400 mb-3">Click on topics to select/deselect them:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set([
                        ...(topicSummary.DSA?.strong || []),
                        ...(topicSummary.DSA?.medium || []),
                        ...(topicSummary.DSA?.weak || []),
                        ...(topicSummary.CSF?.strong || []),
                        ...(topicSummary.CSF?.medium || []),
                        ...(topicSummary.CSF?.weak || [])
                      ])).length > 0 ? (
                        Array.from(new Set([
                          ...(topicSummary.DSA?.strong || []),
                          ...(topicSummary.DSA?.medium || []),
                          ...(topicSummary.DSA?.weak || []),
                          ...(topicSummary.CSF?.strong || []),
                          ...(topicSummary.CSF?.medium || []),
                          ...(topicSummary.CSF?.weak || [])
                        ])).map((t, idx) => {
                          const isSelected = manualSelectedTopics.includes(t);
                          return (
                            <button 
                              key={idx} 
                              onClick={() => handleToggleManualTopic(t)}
                              className={`px-3 py-1.5 rounded-lg border text-xs transition ${
                                isSelected 
                                  ? "bg-purple-600/30 border-purple-500 text-purple-200" 
                                  : "bg-white/5 border-gray-700 hover:border-purple-500 text-gray-300"
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })
                      ) : (
                        <span className="text-xs text-gray-500">Upload a resume to see available topics for selection.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recruiter Hint */}
          <div className="mt-8">
            <h3 className="mb-3 font-semibold">Recruiter Hint</h3>
            <div className="flex flex-wrap gap-3">
              {["Similar Questions", "Generate New Variations", "Focus on Core Concepts", "Include Real-world Scenarios"].map((hint, i) => (
                <button
                  key={i}
                  onClick={() => setRecruiterHint(hint)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    recruiterHint === hint ? "bg-purple-600/20 border-purple-500" : "bg-white/5 border-gray-700 hover:border-purple-500"
                  }`}
                >
                  {hint}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Additional Instructions (Optional)</p>
              <textarea
                value={recruiterHint}
                onChange={(e) => setRecruiterHint(e.target.value)}
                placeholder="E.g. focus more on system design, avoid basic questions..."
                className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 rounded-xl bg-white/5 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Interview Configuration</h3>
          <div className="flex flex-wrap gap-20 items-end">
            <div>
              <p className="text-sm text-gray-400 mb-2">Difficulty</p>
              <div className="flex gap-3">
                {["Easy", "Medium", "Hard"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-2 rounded-lg border ${difficulty === d ? "bg-purple-600/20 border-purple-500" : "bg-white/5 border-gray-700 hover:border-purple-500"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Questions</p>
              <div className="flex gap-4">
                <input 
                  value={dsaCount} 
                  onChange={(e) => setDsaCount(e.target.value)}
                  className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-gray-700 focus:outline-none focus:border-purple-500" 
                  placeholder="DSA" 
                />
                <input 
                  value={csfCount} 
                  onChange={(e) => setCsfCount(e.target.value)}
                  className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-gray-700 focus:outline-none focus:border-purple-500" 
                  placeholder="CSF" 
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleGenerateQuestions}
          disabled={isGenerating}
          className="mt-10 w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg disabled:opacity-50 transition"
        >
          {isGenerating ? "Generating..." : "Generate Questions"}
        </button>

        {/* Questions Section */}
        {generatedQuestions.length > 0 && (
          <div className="mt-12 mb-12">
            <h2 className="text-xl font-semibold mb-4">Generated Questions</h2>
            <div className="space-y-6">
              {generatedQuestions.map((q, i) => (
                <div key={q.id || i} className="p-6 rounded-xl bg-white/5 border border-gray-800 hover:border-purple-500 transition">
                  <h3 className="text-lg font-semibold mb-2">
                    Question {i + 1}: {q.title}
                  </h3>
                  <div className="flex gap-4 text-sm mb-3">
                    <span className="text-purple-400">{q.topic}</span>
                    <span className="text-yellow-400">{q.difficulty}</span>
                  </div>
                  <p className="text-gray-300 mb-3">{q.problem}</p>
                  <details className="text-sm text-gray-400 cursor-pointer">
                    <summary className="hover:text-purple-400 outline-none">View Details</summary>
                    <div className="mt-3 space-y-3 p-3 bg-black/50 rounded-lg">
                      {q.constraints && q.constraints.length > 0 && (
                        <p><strong>Constraints:</strong> {Array.isArray(q.constraints) ? q.constraints.join(", ") : String(q.constraints)}</p>
                      )}
                      {q.example && q.example.length > 0 && (
                        <div>
                          <strong>Examples:</strong>
                          {Array.isArray(q.example) ? (
                            q.example.map((ex: any, idx: number) => (
                              <div key={idx} className="mt-1 pl-3 border-l border-purple-500/30 text-xs">
                                {ex.input && <div>Input: <code className="text-gray-300 bg-white/5 px-1 py-0.5 rounded">{ex.input}</code></div>}
                                {ex.output && <div>Output: <code className="text-gray-300 bg-white/5 px-1 py-0.5 rounded">{ex.output}</code></div>}
                                {ex.explanation && <div className="text-gray-400">Explanation: {ex.explanation}</div>}
                              </div>
                            ))
                          ) : typeof q.example === "object" && q.example !== null ? (
                            <div className="mt-1 pl-3 border-l border-purple-500/30 text-xs">
                              {(q.example as any).input && <div>Input: <code className="text-gray-300 bg-white/5 px-1 py-0.5 rounded">{(q.example as any).input}</code></div>}
                              {(q.example as any).output && <div>Output: <code className="text-gray-300 bg-white/5 px-1 py-0.5 rounded">{(q.example as any).output}</code></div>}
                              {(q.example as any).explanation && <div className="text-gray-400">Explanation: {(q.example as any).explanation}</div>}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400"> {String(q.example)}</span>
                          )}
                        </div>
                      )}
                      {q.edge_cases && q.edge_cases.length > 0 && (
                        <p className="mt-1"><strong>Edge Cases:</strong> {Array.isArray(q.edge_cases) ? q.edge_cases.join(", ") : String(q.edge_cases)}</p>
                      )}
                      {q.expected_answer_points && q.expected_answer_points.length > 0 && (
                        <div>
                          <strong>Expected Answer Points:</strong>
                          <ul className="list-disc pl-5 mt-1 text-xs text-gray-300 space-y-1">
                            {Array.isArray(q.expected_answer_points) ? (
                              q.expected_answer_points.map((pt: string, idx: number) => <li key={idx}>{pt}</li>)
                            ) : (
                              <li>{String(q.expected_answer_points)}</li>
                            )}
                          </ul>
                        </div>
                      )}
                      {q.follow_up_questions && q.follow_up_questions.length > 0 && (
                        <div>
                          <strong className="mt-2 block">Follow-up Questions:</strong>
                          <ul className="list-disc pl-5 mt-1 text-xs text-gray-300 space-y-1">
                            {Array.isArray(q.follow_up_questions) ? (
                              q.follow_up_questions.map((fq: string, idx: number) => <li key={idx}>{fq}</li>)
                            ) : (
                              <li>{String(q.follow_up_questions)}</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <aside className="w-80 bg-[#0a0a0f] border-l border-gray-800 p-6 flex flex-col h-screen overflow-y-auto gap-6">
        <div className="flex-1 flex flex-col p-4 rounded-xl bg-white/5 border border-gray-800 justify-between">
          <div>
            <h3 className="text-sm font-semibold mb-2">LeetCode Analysis</h3>
            <p className="text-xs text-gray-400 mb-3">Stats</p>
            <div className="flex justify-center h-40 items-center">
              <PieChart width={160} height={160}>
                <Pie data={leetcodeData} dataKey="value" outerRadius={60} innerRadius={0} cx="50%" cy="50%">
                  {leetcodeData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="mt-3 text-sm space-y-2">
              <p className="text-green-400 text-xs">
                <strong>Strong:</strong> {leetcodeInsights.strong.length ? leetcodeInsights.strong.join(", ") : "None"}
              </p>
              <p className="text-yellow-400 text-xs">
                <strong>Medium:</strong> {leetcodeInsights.medium.length ? leetcodeInsights.medium.join(", ") : "None"}
              </p>
              <p className="text-red-400 text-xs">
                <strong>Weak:</strong> {leetcodeInsights.weak.length ? leetcodeInsights.weak.join(", ") : "None"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 rounded-xl border border-dashed border-gray-700 bg-white/5">
          <div className="text-center w-full">
            <p className="text-sm text-gray-400 mb-3">
              {sessionId ? "Resume Uploaded" : "Upload Resume"}
            </p>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.txt"
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="bg-purple-600/20 border border-purple-500 text-purple-300 w-full px-4 py-2.5 rounded-lg hover:bg-purple-600/30 transition disabled:opacity-50 text-sm font-medium"
            >
              {isAnalyzing ? "Analyzing..." : (sessionId ? "Upload Another" : "Upload")}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}