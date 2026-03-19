"use client";

import { useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import CityMap from "@/components/emergency/CityMap";
import PathPanel from "@/components/emergency/PathPanel";
import { NODES } from "@/lib/graph";
import { SearchResult, ServiceType, AlgorithmType } from "@/types";
import { Ambulance, ShieldAlert, Flame, RotateCcw } from "lucide-react";

export default function EmergencyPage() {
  const [source, setSource] = useState<string | null>(null);
  const [service, setService] = useState<ServiceType>("ambulance");
  const [algo, setAlgo] = useState<AlgorithmType>("astar");
  
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [statusMsg, setStatusMsg] = useState("Click a node on the map to set your location, then dispatch.");

  const handleDispatch = async () => {
    if (!source) {
      setStatusMsg("⚠️ Please click a node to set your location first.");
      return;
    }
    
    setIsSearching(true);
    setResult(null);
    setStatusMsg(`🔍 ${algo === "bfs" ? "BFS" : "A*"} searching for nearest ${service}…`);

    try {
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, service, algorithm: algo }),
      });
      const data = await res.json();
      
      if (data.path && data.path.length > 0) {
        setResult(data);
      } else {
        setStatusMsg("❌ No path found.");
        setIsSearching(false);
      }
    } catch (e) {
      setStatusMsg("❌ Error connecting to server.");
      setIsSearching(false);
    }
  };

  const reset = () => {
    setSource(null);
    setResult(null);
    setIsSearching(false);
    setStatusMsg("Click a node on the map to set your location, then dispatch.");
  };

  return (
    <>
      <ParticleBackground />
      <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 animate-fade-in relative z-10">
        
        {/* Header */}
        <div className="lg:col-span-2 flex items-center gap-4 py-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
            <Ambulance size={24} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Emergency Response System</h1>
            <p className="text-sm text-slate-400 mt-1">A* Pathfinding · Graph Search · Intelligent Agent</p>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex flex-col rounded-2xl bg-[#050810]/80 border border-white/10 overflow-hidden backdrop-blur-md">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-white/10 flex flex-wrap items-center gap-3 bg-white/[0.02]">
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-500 mr-2">Service:</span>
            
            <button 
              onClick={() => setService("ambulance")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${service === "ambulance" ? "bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_0_12px_rgba(255,71,87,0.2)]" : "bg-transparent text-slate-400 border-transparent hover:bg-white/5"}`}
            >
              <Ambulance size={16} /> Ambulance
            </button>
            
            <button 
              onClick={() => setService("police")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${service === "police" ? "bg-blue-500/15 text-blue-400 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]" : "bg-transparent text-slate-400 border-transparent hover:bg-white/5"}`}
            >
              <ShieldAlert size={16} /> Police
            </button>
            
            <button 
              onClick={() => setService("fire")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${service === "fire" ? "bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.2)]" : "bg-transparent text-slate-400 border-transparent hover:bg-white/5"}`}
            >
              <Flame size={16} /> Fire
            </button>

            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400 w-6">A*</span>
              <button 
                onClick={() => setAlgo(algo === "astar" ? "bfs" : "astar")}
                className={`relative w-10 h-5 rounded-full transition-colors ${algo === "bfs" ? "bg-[#a29bfe]" : "bg-white/20"}`}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${algo === "bfs" ? "translate-x-5" : "translate-x-0"}`} />
              </button>
              <span className="text-xs font-medium text-slate-400">BFS</span>
              
              <button onClick={reset} className="ml-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Canvas map */}
          <div className="flex-1 relative min-h-[400px]">
            <CityMap 
              selectedNode={source} 
              onNodeSelect={(id) => { setSource(id); setResult(null); setStatusMsg("📍 Location set. Click dispatch."); }}
              result={result}
              onAnimationEnd={() => {
                setIsSearching(false);
                if (result) setStatusMsg(`✅ Route found! ${result.nodesExplored} nodes explored via ${algo === "bfs" ? "BFS" : "A*"}.`);
              }}
            />
          </div>

          {/* Status/Dispatch */}
          <div className="p-3 border-t border-white/10 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className={`w-2.5 h-2.5 rounded-full ${isSearching ? "bg-yellow-400 animate-pulse" : result ? "bg-[#00ff88] shadow-[0_0_8px_#00ff88]" : "bg-slate-500"}`} />
              {statusMsg}
            </div>
            
            <button 
              onClick={handleDispatch}
              disabled={!source || isSearching}
              className="neo-btn neo-btn-red py-2 px-5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Dispatch Agent
            </button>
          </div>

        </div>

        {/* Right Panel */}
        <div className="order-first lg:order-last">
          <PathPanel source={source} result={result} algo={algo} />
        </div>

        {/* --- EXPANDED ALGORITHM TRACE --- */}
        {result && result.frames && result.frames.length > 0 && (
          <div className="lg:col-span-2 mt-2 animate-fade-in shadow-[0_0_50px_rgba(0,210,211,0.08)] border border-teal-500/20 rounded-2xl overflow-hidden bg-[#050810]/95 backdrop-blur-xl">
            <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-teal-500/10 via-purple-500/5 to-transparent relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
              <h2 className="font-display text-2xl font-bold flex items-center gap-3 text-white/90 relative z-10">
                <span className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">
                  <RotateCcw size={20} />
                </span>
                Systematic Algorithm Execution Trace
              </h2>
              <p className="text-sm text-slate-400 mt-2 relative z-10 max-w-3xl">
                Detailed step-by-step breakdown of how the <strong>{algo === "bfs" ? "Breadth-First Search" : "A* Search"}</strong> navigates the graph. Shows exact states of the <span className="text-[#a29bfe] font-semibold">Open Set (Frontier)</span> and <span className="text-rose-400 font-semibold">Closed Set (Explored)</span> at each evaluation step.
              </p>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-h-[550px] overflow-y-auto custom-scrollbar bg-black/40">
              {result.frames.map((frame, i) => {
                const currentNode = NODES[frame.current];
                return (
                  <div key={i} className="glass p-5 rounded-2xl border border-white/5 bg-[#050810]/60 hover:bg-[#050810]/90 hover:border-teal-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg hover:shadow-[0_0_25px_rgba(0,210,211,0.1)] hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#a29bfe] to-[#00d2d3] opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4 pl-3">
                       <div className="font-mono text-xs font-black tracking-widest text-[#00d2d3] bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 shadow-[0_0_10px_rgba(0,210,211,0.2)]">STEP {i + 1}</div>
                       <div className="text-[10px] text-slate-500 font-mono font-bold tracking-widest">FRAME LOG</div>
                    </div>
                    
                    <div className="pl-3 mb-4">
                      <div className="text-[11px] text-slate-400 mb-1.5 uppercase tracking-wider font-semibold">Currently Evaluating</div>
                      <div className="font-display text-lg font-bold text-white tracking-wide flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd32a] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ffd32a]"></span>
                        </span>
                        {currentNode?.label || 'Unknown'}
                      </div>
                      <div className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Node expanded to evaluate neighbors and path costs.
                      </div>
                    </div>

                    <div className="pl-3 space-y-3 pt-3 border-t border-white/5 bg-black/20 -mx-5 px-8 pb-2 mt-4">
                      <div>
                        <div className="text-[10px] font-bold text-[#a29bfe] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#a29bfe]"></div> Open Set (Frontier)
                        </div>
                        <div className="text-xs font-mono text-slate-300 leading-relaxed bg-[#050810]/80 p-3 rounded-lg border border-white/5 shadow-inner">
                          {frame.open.length > 0 ? frame.open.map(n => NODES[n]?.label).join(", ") : <span className="text-slate-600 italic">Empty</span>}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div> Closed Set (Explored)
                        </div>
                        <div className="text-xs font-mono text-slate-500 leading-relaxed bg-[#050810]/80 p-3 rounded-lg border border-white/5 shadow-inner">
                          {frame.closed.length > 0 ? frame.closed.map(n => NODES[n]?.label).join(", ") : <span className="text-slate-600 italic">None</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
