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
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Placeholder */}
        <div className="border border-gray-800 rounded-xl p-6 bg-white/5">
          <p className="text-gray-400">
            Upload resume to start analysis...
          </p>
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
      </aside>
    </div>
  );
}