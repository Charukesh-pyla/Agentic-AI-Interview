export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">

      {/* 🌌 Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-3xl rounded-full top-[-200px] left-[-200px]" />
        <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full bottom-[-200px] right-[-200px]" />
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 max-w-6xl mx-auto w-full">
        <h1 className="text-xl font-bold">IntervAI</h1>

        <div className="hidden md:flex gap-8 text-gray-400">

  {["Home", "Explore", "Dashboard", "About"].map((item, i) => (
    <a
      key={i}
      href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
      className="
        relative 
        hover:text-white 
        transition 
        duration-300
        after:absolute after:left-0 after:-bottom-1 
        after:h-[2px] after:w-0 
        after:bg-gradient-to-r after:from-purple-500 after:to-blue-500
        after:transition-all after:duration-300
        hover:after:w-full
      "
    >
      {item}
    </a>
  ))}

</div>

        <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg">
          Start →
        </button>
      </nav>

      {/* Hero */}
<section className="flex flex-col items-center justify-center text-center min-h-[90vh] px-6">
        <h1 className="text-5xl md:text-6xl font-bold">
          AI Interview Question
        </h1>

        <h2 className="text-5xl md:text-6xl font-bold mt-4 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Generator Platform
        </h2>

        <p className="mt-6 text-gray-400 max-w-2xl">
          Upload candidate resumes, analyze skills, and generate tailored
          DSA & CS fundamentals interview questions instantly.
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="/dashboard"
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg shadow-lg"
          >
            Go to Dashboard →
          </a>

          <button className="bg-gray-800 px-6 py-3 rounded-lg hover:bg-gray-700">
            Learn More
          </button>
        </div>
      </section>

     {/* Features */}
<section className="mt-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

  {[
    {
      title: "Resume Analysis",
      desc: "Extract skills, projects and strengths from resumes using AI",
    },
    {
      title: "Smart Question Generation",
      desc: "Generate DSA & CS questions based on candidate profile",
    },
    {
      title: "Adaptive Interviews",
      desc: "Customize difficulty & topics dynamically for recruiters",
    },
    {
      title: "LeetCode Insights",
      desc: "Analyze coding profile and topic-wise strengths",
    },
    {
      title: "Topic Selection",
      desc: "Recruiters can choose focus areas before generating questions",
    },
    {
      title: "Validation Engine",
      desc: "Ensures questions are correct and interview-ready",
    },
  ].map((card, i) => (
    <div
      key={i}
      className="
        fade-up
        p-6 rounded-xl 
        bg-white/5 
        border border-gray-800 
        transition-all duration-300 
        hover:border-purple-500 
        hover:shadow-lg hover:shadow-purple-500/20 
        hover:-translate-y-2
      "
      style={{ animationDelay: `${i * 0.1}s` }}
    >
      <h3 className="text-lg font-semibold text-white">{card.title}</h3>
      <p className="text-gray-400 mt-2">{card.desc}</p>
    </div>
  ))}

</section>
      {/* Footer (NEW ✅) */}
    <footer className="mt-32 border-t border-gray-800 px-6 py-10 text-gray-400">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        <div>
          <h3 className="text-white font-semibold mb-2">IntervAI</h3>
          <p>AI-powered interview preparation platform for recruiters.</p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">Links</h4>
          <ul className="space-y-1">
            <li>Home</li>
            <li>Dashboard</li>
            <li>Explore</li>
            <li>About</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">Contact</h4>
          <p>Email: support@intervai.ai</p>
          <p>GitHub: your-link</p>
        </div>

      </div>

      <div className="text-center mt-8 text-sm text-gray-500">
        © 2026 IntervAI. All rights reserved.
      </div>
    </footer>

    </main>
  );
}