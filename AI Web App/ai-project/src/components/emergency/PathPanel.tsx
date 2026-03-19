import { NODES } from "@/lib/graph";
import { SearchResult } from "@/types";
import { RefreshCcw } from "lucide-react";

interface PathPanelProps {
  source: string | null;
  result: SearchResult | null;
  algo: string;
}

export default function PathPanel({ source, result, algo }: PathPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Path Analytics */}
      <div className="glass p-5">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">📊 Path Analytics</h3>
        
        <div className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
          <span className="text-slate-400">Source Node</span>
          <span className="font-semibold text-red-400">{source ? NODES[source].label : "—"}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
          <span className="text-slate-400">Destination</span>
          <span className="font-semibold text-teal-400">{result?.goal ? NODES[result.goal].label : "—"}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
          <span className="text-slate-400">Algorithm</span>
          <span className="font-semibold">{algo === "bfs" ? "BFS Search" : "A* Search"}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
          <span className="text-slate-400">Distance</span>
          <span className="font-semibold text-yellow-400">{result?.cost ? `${result.cost} km` : "—"}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
          <span className="text-slate-400">ETA</span>
          <span className="font-semibold text-yellow-400">{result?.cost ? `${Math.ceil(result.cost * 1.5)} min` : "—"}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
          <span className="text-slate-400">Nodes Explored</span>
          <span className="font-semibold">{result?.nodesExplored || "—"}</span>
        </div>
        <div className="flex justify-between items-start py-2 text-sm">
          <span className="text-slate-400 shrink-0">Path</span>
          <span className="text-[11px] text-right font-mono ml-4 text-slate-300">
            {result?.path ? result.path.map(n => NODES[n].label).join(" → ") : "—"}
          </span>
        </div>
      </div>

      {/* AI Concept */}
      <div className="glass p-5 bg-purple-500/5 border-purple-500/10">
        <h4 className="font-display font-bold text-sm text-[#a29bfe] mb-3 flex items-center gap-2">⭐ {algo === "astar" ? "A* Search" : "BFS (Comparison)"}</h4>
        {algo === "astar" ? (
          <>
            <div className="bg-black/30 border-l-2 border-[#a29bfe] px-3 py-2 font-mono text-sm text-[#a29bfe] mb-3 text-center rounded">
              f(n) = g(n) + h(n)
            </div>
            <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
              <li><code>g(n)</code> — cost from source to node n</li>
              <li><code>h(n)</code> — Manhattan distance to goal</li>
              <li>Priority queue orders by lowest f(n)</li>
              <li>Guarantees optimal path</li>
            </ul>
          </>
        ) : (
          <p className="text-xs text-slate-400 leading-relaxed">
            Breadth-First Search ignores edge weights. It explores uniformly in all directions, finding the shortest path <em>by number of hops</em>, but often failing to find the cheapest path by actual distance.
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="glass p-5">
        <h3 className="font-display font-bold text-sm mb-3">🗺️ Legend</h3>
        <div className="flex flex-col gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ff4757]"></div> Source</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#00ff88]"></div> Destination</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#a29bfe]"></div> Open Set (A*)</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#2d3748]"></div> Closed Set (Explored)</div>
          <div className="flex items-center gap-2"><div className="w-6 h-1 rounded bg-gradient-to-r from-[#ff4757] to-[#00d2d3]"></div> Final Path</div>
        </div>
      </div>
    </div>
  );
}
