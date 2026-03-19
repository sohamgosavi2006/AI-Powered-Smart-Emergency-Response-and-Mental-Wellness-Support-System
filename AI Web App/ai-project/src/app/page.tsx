import ParticleBackground from "@/components/ParticleBackground";
import Link from "next/link";
import { ArrowRight, Brain, Ambulance } from "lucide-react";

export default function Home() {
  return (
    <>
      <ParticleBackground />
      
      {/* Background Blobs */}
      <div className="fixed w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[80px] -top-20 -left-20 animate-[float_8s_ease-in-out_infinite]" />
      <div className="fixed w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[80px] -bottom-40 -right-20 animate-[float_10s_ease-in-out_infinite_reverse]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] animate-[float_12s_ease-in-out_infinite]" />

      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 text-center max-w-5xl mx-auto">
        
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase text-[#a29bfe] mb-8 animate-fade-in">
          <span>🎓</span> Semester 4 · AI Lab Project
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          Intelligent Systems for<br />
          <span className="text-gradient">Real-World Impact</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-12">
          Two AI-powered applications built with Next.js — using graph search algorithms,
          NLP, and the Gemini Large Language Model to solve real emergencies and mental health challenges.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <div className="glass px-4 py-1.5 text-xs font-medium text-slate-300">⭐ A* Search</div>
          <div className="glass px-4 py-1.5 text-xs font-medium text-slate-300">🔵 BFS</div>
          <div className="glass px-4 py-1.5 text-xs font-medium text-slate-300">💬 NLP</div>
          <div className="glass px-4 py-1.5 text-xs font-medium text-slate-300">🤖 Prompt Engineering</div>
          <div className="glass px-4 py-1.5 text-xs font-medium text-slate-300">🧠 Gemini 1.5 LLM</div>
        </div>

        {/* Start Module Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl text-left">
          
          {/* Emergency Card */}
          <Link href="/emergency" className="group relative block p-8 rounded-[32px] bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 overflow-hidden transition-all hover:-translate-y-2 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(255,71,87,0.15)]">
            <div className="w-16 h-16 rounded-2xl bg-red-500/15 flex items-center justify-center mb-6 text-red-400 group-hover:scale-110 transition-transform">
              <Ambulance size={32} />
            </div>
            
            <div className="flex gap-2 mb-4">
              <span className="badge badge-red">Graph Search</span>
              <span className="badge badge-purple">A* Algorithm</span>
            </div>
            
            <h2 className="font-display text-2xl font-bold mb-3 tracking-tight">Emergency Response</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              AI dispatches help instantly. Given any location, the system finds the
              shortest path to the nearest hospital, police, or fire brigade using A* 
              with Manhattan-distance heuristic.
            </p>
            
            <div className="flex items-center justify-between pt-5 border-t border-white/5">
              <span className="text-[#ff4757] font-semibold text-sm">Launch Emergency AI</span>
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-[#ff4757] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>

          {/* Chatbot Card */}
          <Link href="/chatbot" className="group relative block p-8 rounded-[32px] bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 overflow-hidden transition-all hover:-translate-y-2 hover:border-teal-500/50 hover:shadow-[0_0_40px_rgba(0,210,211,0.15)]">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/15 flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform">
              <Brain size={32} />
            </div>
            
            <div className="flex gap-2 mb-4">
              <span className="badge badge-teal">Gemini LLM</span>
              <span className="badge badge-purple">NLP Sentiment</span>
            </div>
            
            <h2 className="font-display text-2xl font-bold mb-3 tracking-tight">Mental Health Chatbot</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              An empathetic AI counsellor powered by <strong>Google Gemini Flash</strong>.
              Detects sentiment in real time, responds with emotional intelligence,
              and escalates to helplines in crisis.
            </p>
            
            <div className="flex items-center justify-between pt-5 border-t border-white/5">
              <span className="text-[#00d2d3] font-semibold text-sm">Start Chatting</span>
              <div className="w-10 h-10 rounded-full bg-teal-500/10 text-[#00d2d3] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Concepts Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-white/10 mt-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4 px-4 py-1 border-b border-white/10">AI Concepts Covered</div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Academic Foundation</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass p-6">
            <h4 className="font-display font-bold text-lg text-[#a29bfe] mb-2 flex items-center gap-2">⭐ A* Search</h4>
            <div className="font-mono text-sm inline-block bg-black/40 px-3 py-1 rounded border-l-2 border-[#a29bfe] mb-4">f(n) = g(n) + h(n)</div>
            <p className="text-sm text-slate-400">Finds optimal paths. <code>g(n)</code> = cost so far, <code>h(n)</code> = Manhattan heuristic to goal. Powered by Priority Queue (Min-Heap).</p>
          </div>
          
          <div className="glass p-6">
            <h4 className="font-display font-bold text-lg text-[#00d2d3] mb-2 flex items-center gap-2">🧠 Gemini LLM</h4>
            <div className="font-mono text-sm inline-block bg-black/40 px-3 py-1 rounded border-l-2 border-[#00d2d3] mb-4">Lang Agent</div>
            <p className="text-sm text-slate-400">Large Language Models (LLMs) are capable of understanding, summarizing, predicting, and generating contextual, empathetic responses.</p>
          </div>

          <div className="glass p-6">
            <h4 className="font-display font-bold text-lg text-slate-300 mb-2 flex items-center gap-2">💬 NLP Sentiment</h4>
            <div className="font-mono text-sm inline-block bg-black/40 px-3 py-1 rounded border-l-2 border-slate-500 mb-4">Score: [-1, +1]</div>
            <p className="text-sm text-slate-400">Natural Language Processing scans inputs against weighted lexicons to extract emotion variables before passing contexts to the LLM agent.</p>
          </div>
        </div>
      </section>
      
      <footer className="text-center py-8 border-t border-white/5 text-xs text-slate-500">
        Built with Next.js, Tailwind, Prisma & Gemini for Semester 4 AI Lab.
      </footer>
    </>
  );
}
