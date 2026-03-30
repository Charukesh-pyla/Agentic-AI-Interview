export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-6">AI Interview</h2>
        <nav className="space-y-4">
          <p className="hover:text-purple-400 cursor-pointer">Dashboard</p>
          <p className="hover:text-purple-400 cursor-pointer">Upload Resume</p>
          <p className="hover:text-purple-400 cursor-pointer">Generate Questions</p>
          <p className="hover:text-purple-400 cursor-pointer">Settings</p>
        </nav>
      </aside>

      {/* Main Content */}
  <main className="flex-1 p-8">
    <h1 className="text-purple-400 font-semibold">Dashboard</h1>

    {/* Upload Box */}
    <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center bg-white/5 hover:border-purple-500 transition">
      
      <p className="text-gray-400 mb-2 text-lg">
        Drag & drop resume here
      </p>

      <p className="text-sm text-gray-500 mb-4">
        or click to upload
      </p>

      <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 rounded-lg">
        Upload Resume
      </button>

    </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
    Supported formats: PDF, DOCX
  </p>
  <h2 className="text-xl font-semibold mt-10 mb-4">
  Candidate Summary
</h2>
{/* Candidate Summary */}
<div className="mt-10 grid md:grid-cols-2 gap-6">

  {/* Skills */}
  <div className="p-6 rounded-xl bg-white/5 border border-gray-800">
    <h2 className="text-lg font-semibold mb-4">Skills Detected</h2>

    <div className="flex flex-wrap gap-2">
      {["Python", "Java", "React", "SQL"].map((skill, i) => (
        <span
          key={i}
          className="px-3 py-1 text-sm bg-purple-600/20 border border-purple-500 rounded-full"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>

  {/* Strengths & Weakness */}
  <div className="p-6 rounded-xl bg-white/5 border border-gray-800">
    <h2 className="text-lg font-semibold mb-4">Topic Analysis</h2>

    <div className="space-y-2 text-sm">
      <p className="text-green-400">Strong: Array</p>
      <p className="text-yellow-400">Medium: Hash Table, String</p>
      <p className="text-red-400">Weak: Dynamic Programming</p>
    </div>
  </div>

</div>
{/* Topic Selection */}
<div className="mt-12">
  <h2 className="text-xl font-semibold mb-4">Select Interview Configuration</h2>

  <div className="grid md:grid-cols-2 gap-6">

    {/* DSA Topics */}
    <div className="p-6 rounded-xl bg-white/5 border border-gray-800">
      <h3 className="mb-3 font-semibold">DSA Topics</h3>

      <div className="space-y-2 text-sm">
        {["Array", "Hash Table", "Dynamic Programming", "String"].map((topic, i) => (
          <label key={i} className="flex items-center gap-2">
            <input type="checkbox" className="accent-purple-500" />
            {topic}
          </label>
        ))}
      </div>
    </div>

    {/* CSF Topics */}
    <div className="p-6 rounded-xl bg-white/5 border border-gray-800">
      <h3 className="mb-3 font-semibold">CS Fundamentals</h3>

      <div className="space-y-2 text-sm">
        {["OS", "DBMS", "OOP", "CN"].map((topic, i) => (
          <label key={i} className="flex items-center gap-2">
            <input type="checkbox" className="accent-purple-500" />
            {topic}
          </label>
        ))}
      </div>
    </div>

  </div>

  {/* Config Row */}
  <div className="mt-6 flex flex-wrap gap-6 items-center">

    {/* Difficulty */}
    <select className="bg-white/5 border border-gray-700 rounded-lg px-4 py-2">
      <option>Easy</option>
      <option>Medium</option>
      <option>Hard</option>
    </select>

    {/* Question Count */}
    <input
      type="number"
      placeholder="No. of Questions"
      className="bg-white/5 border border-gray-700 rounded-lg px-4 py-2 w-48"
    />

    {/* Generate Button */}
    <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 rounded-lg shadow-lg hover:shadow-purple-500/20">
      Generate Questions 🚀
    </button>

  </div>
  
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

      {/* Right Panel */}
      <aside className="w-80 bg-white/5 border-l border-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Insights</h2>

        <div className="border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            LeetCode stats will appear here
          </p>
          
        </div>
        <div className="space-y-2 text-sm">
          <p>Easy: 120</p>
          <p>Medium: 80</p>
          <p>Hard: 20</p>
        </div>
      </aside>
    </div>
  );
}