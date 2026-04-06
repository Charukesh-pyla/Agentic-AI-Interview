"use client";
"recharts";
import { useState } from "react";

import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Easy", value: 120 },
  { name: "Medium", value: 80 },
  { name: "Hard", value: 20 },
];

const strategyData: Record<string, string[]> = {
  "Focus on Strong Topics": ["Arrays", "Strings"],
  "Balanced Interview": ["Arrays", "DP", "Graph", "OS", "DBMS"],
  "Challenge Weak Topics": ["Dynamic Programming", "Graphs"],
  "Manual Topic Selection": [],
};

export default function Dashboard() {
  const [selectedStrategy, setSelectedStrategy] = useState("Balanced Interview");
  const COLORS = ["#22c55e", "#eab308", "#ef4444"];
  return (
    <div className="flex min-h-screen bg-black text-white">
      
<aside className="w-64 bg-[#0a0a0f] border-r border-gray-800 p-6">

  {/* Logo */}
  <h2 className="text-xl font-bold mb-8">IntervAI</h2>

  <p className="text-xs text-gray-500 mb-4">MAIN MENU</p>

  <nav className="space-y-2">

    {[
      "Dashboard",
      "Candidates",
      "Question Generator",
      "Insights",
      "Settings",
    ].map((item, i) => (
      <div
        key={i}
        className={`px-4 py-3 rounded-lg cursor-pointer transition
        ${i === 0
          ? "bg-white/10 text-white"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        {item}
      </div>
    ))}

  </nav>
</aside>

      {/* Main Content */}
  <main className="flex-1 p-8">
    <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

{/* Candidate Summary */}
<div className="mt-10 grid md:grid-cols-1 gap-6">

<div className="mt-8 p-6 rounded-xl bg-white/5 border border-gray-800 flex gap-4 items-start">

  {/* Avatar */}
  <div className="w-16 h-16 rounded-full bg-gray-700 flex-shrink-0" />

  {/* Text */}
  <div>
    <h2 className="text-lg font-semibold mb-2">Candidate Profile</h2>

    <p className="text-gray-400 leading-relaxed text-sm">
      Software engineer with strong proficiency in Python, Java, and SQL,
      with experience in backend development and problem-solving.
      Demonstrates solid understanding of data structures and algorithms,
      with moderate exposure to system design concepts.
    </p>
          <div className="mt-4">
      <p className="text-lg font-semibold mb-2">Skills Detected</p>

      <div className="flex flex-wrap gap-2">
        {["Python", "Java", "React", "SQL"].map((skill, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs rounded-full 
            bg-purple-600/20 border border-purple-500 text-purple-300"
          >
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
  <h2 className="text-xl font-semibold mb-4">
    Select Interview Strategy
  </h2>

  <div className="space-y-3">
    {Object.keys(strategyData).map((strategy, i) => (
      <div key={i}>

        {/* Strategy Button */}
        <button
          onClick={() => setSelectedStrategy(strategy)}
          className={`w-full text-left px-5 py-4 rounded-xl transition border
          ${
            selectedStrategy === strategy
              ? "bg-purple-600/20 border-purple-500"
              : "bg-white/5 border-gray-800 hover:border-purple-500 hover:bg-white/10"
          }`}
        >
          <div className="font-medium">{i + 1}. {strategy}</div>
          <p className="text-xs text-gray-400 mt-1">
            {strategy === "Focus on Strong Topics" && "Questions from candidate strengths"}
            {strategy === "Balanced Interview" && "Mix of all topics"}
            {strategy === "Challenge Weak Topics" && "Focus on weak areas"}
            {strategy === "Manual Topic Selection" && "Manually choose topics"}
          </p>
        </button>

        {/* 🔥 EXPANDED SECTION */}
        {selectedStrategy === strategy && strategy !== "Manual Topic Selection" && (
          <div className="mt-3 p-4 rounded-xl bg-white/5 border border-gray-800">

            <p className="text-xs text-gray-400 mb-2">
              Auto-selected topics
            </p>

            <div className="flex flex-wrap gap-2">
              {strategyData[strategy].map((topic, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs rounded-full 
                  bg-purple-600/20 border border-purple-500"
                >
                  {topic}
                </span>
              ))}
            </div>

          </div>
        )}

        {/* 🔥 Manual Mode → show topic buttons */}
        {selectedStrategy === "Manual Topic Selection" && strategy === selectedStrategy && (
          <div className="mt-3 p-4 rounded-xl bg-white/5 border border-gray-800">

            <p className="text-xs text-gray-400 mb-3">Select Topics</p>

            <div className="flex flex-wrap gap-3">
              {["Array", "DP", "Graph", "OS", "DBMS", "OOP"].map((t, idx) => (
                <button
                  key={idx}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-gray-700 hover:border-purple-500"
                >
                  {t}
                </button>
              ))}
            </div>

          </div>
        )}

      </div>
    ))}
{/* Recruiter Hint */}
<div className="mt-8">
  <h3 className="mb-3 font-semibold">Recruiter Hint</h3>

  <div className="flex flex-wrap gap-3">
    {[
      "Similar Questions",
      "Generate New Variations",
      "Focus on Core Concepts",
      "Include Real-world Scenarios",
    ].map((hint, i) => (
      <button
        key={i}
        className="px-4 py-2 rounded-lg bg-white/5 border border-gray-700 hover:border-purple-500 hover:bg-white/10 transition"
      >
        {hint}
      </button>
    ))}
    
  </div>
  <div className="mt-6">
  <p className="text-sm text-gray-400 mb-2">
    Additional Instructions (Optional)
  </p>

  <textarea
    placeholder="E.g. focus more on system design, avoid basic questions..."
    className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-sm 
    focus:outline-none focus:border-purple-500 resize-none"
    rows={3}
  />
</div>
</div>

  </div>




<div className="mt-10 p-6 rounded-xl bg-white/5 border border-gray-800">

  <h3 className="text-lg font-semibold mb-4">Interview Configuration</h3>

  <div className="flex flex-wrap gap-20 items-end">

    {/* Difficulty */}
    <div>
      <p className="text-sm text-gray-400 mb-2">Difficulty</p>
      <div className="flex gap-3">
      {["Easy", "Medium", "Hard"].map((d) => (
        <button
          key={d}
          className="px-4 py-2 rounded-lg bg-white/5 border border-gray-700 hover:border-purple-500"
        >
          {d}
        </button>
      ))}
      </div>
    </div>

    {/* Questions */}
    <div>
      <p className="text-sm text-gray-400 mb-2">Questions</p>
      <div className="flex gap-4">
        <input className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-gray-700" placeholder="DSA" />
        <input className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-gray-700" placeholder="CSF" />
      </div>
    </div>

  </div>
</div>

  <button className="mt-10 w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg">
  Generate Questions 
</button>
  {/* Questions Section */}
<div className="mt-12">
  <h2 className="text-xl font-semibold mb-4">Generated Questions</h2>

  <div className="space-y-6">

    {[1, 2].map((q, i) => (
      <div
        key={i}
        className="p-6 rounded-xl bg-white/5 border border-gray-800 hover:border-purple-500 transition"
      >
        {/* Title */}
        <h3 className="text-lg font-semibold mb-2">
          Question {i + 1}: Two Sum Variant
        </h3>

        {/* Difficulty + Topic */}
        <div className="flex gap-4 text-sm mb-3">
          <span className="text-purple-400">Array</span>
          <span className="text-yellow-400">Medium</span>
        </div>

        {/* Problem */}
        <p className="text-gray-300 mb-3">
          Given an array of integers, find two numbers such that they add up to a target...
        </p>

        {/* Expand Button */}
        <details className="text-sm text-gray-400 cursor-pointer">
          <summary className="hover:text-purple-400">View Details</summary>

          <div className="mt-3 space-y-2">
            <p><strong>Constraints:</strong> 1 ≤ n ≤ 10⁵</p>
            <p><strong>Example:</strong> Input: [2,7,11,15], target=9 → Output: [0,1]</p>
            <p><strong>Edge Case:</strong> No solution exists</p>
          </div>
        </details>

      </div>
    ))}

  </div>
</div>
</div>
  </main>

{/* right panel*/}
<aside className="w-80 bg-[#0a0a0f] border-l border-gray-800 p-6 flex flex-col h-screen">

  {/* Top Half */}
  <div className="flex-1 flex flex-col justify-between p-4 rounded-xl bg-white/5 border border-gray-800">

    <div>
      <h3 className="text-sm font-semibold mb-2">LeetCode Analysis</h3>
      <p className="text-xs text-gray-400 mb-3">Stats</p>

    <PieChart width={200} height={200}>
      <Pie data={data} dataKey="value" outerRadius={80}>
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
    </PieChart>
    
    </div>
      {/* 🔥 ADD THIS */}
    <div className="mt-3 text-sm space-y-1">
      <p className="text-green-400">Strong: Arrays, Strings</p>
      <p className="text-yellow-400">Medium: Hashing</p>
      <p className="text-red-400">Weak: Dynamic Programming</p>
    </div>

  </div>

  {/* Gap */}
  <div className="h-6" />

  {/* Bottom Half */}
  <div className="flex-1 flex items-center justify-center p-4 rounded-xl border border-dashed border-gray-700 bg-white/5">

    <div className="text-center">
      <p className="text-sm text-gray-400 mb-3">
        Upload Resume
      </p>

      <button className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition">
        Upload
      </button>
    </div>

  </div>

</aside>
      
    </div>
  );
}