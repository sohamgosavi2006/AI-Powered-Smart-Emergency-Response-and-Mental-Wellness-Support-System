import { prisma } from "@/lib/prisma";
import ParticleBackground from "@/components/ParticleBackground";
import { Database, Activity, ShieldAlert, Route, MessageSquareWarning, Hospital } from "lucide-react";

// Revalidate data periodically (e.g., every 5 seconds or allow dynamic refresh)
export const revalidate = 0; // Disable static caching so it always fetches fresh data on load

export default async function DataCore() {
  // Fetch newest 50 incidents
  const incidents = await prisma.emergencyIncident.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Fetch newest 50 chat sessions with messages
  const chatSessions = await prisma.chatSession.findMany({
    orderBy: { createdAt: "desc" },
    include: { messages: true },
    take: 50,
  });

  // Aggregation & Statistics for Emergency
  const totalIncidents = await prisma.emergencyIncident.count();
  const avgDistanceTotal = incidents.reduce((acc, curr) => acc + curr.distanceKm, 0);
  const avgDistance = incidents.length > 0 ? (avgDistanceTotal / incidents.length).toFixed(1) : "0";
  const astarCount = incidents.filter((i) => i.algorithm === "astar").length;

  // Aggregation & Statistics for Mental Wellness Chat
  const totalSessions = await prisma.chatSession.count();
  const allMessages = chatSessions.flatMap((s) => s.messages);
  const totalCrisisMessages = allMessages.filter((m) => m.isCrisis).length;
  const avgSentiment = allMessages.filter(m => m.sentimentScore !== null).length > 0
    ? (allMessages.reduce((acc, m) => acc + (m.sentimentScore || 0), 0) / allMessages.filter(m => m.sentimentScore !== null).length).toFixed(2)
    : "0.00";

  return (
    <>
      <ParticleBackground />
      <div className="max-w-6xl mx-auto px-6 animate-fade-in relative z-10">
        <div className="flex items-center gap-4 py-6 border-b border-white/10 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#a29bfe]/10 flex items-center justify-center text-[#a29bfe] shrink-0 border border-[#a29bfe]/20">
            <Database size={28} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">System Data Core</h1>
            <p className="text-sm text-slate-400 mt-1">
              Centralized telemetry for Emergency Response & Mental Wellness AI models.
            </p>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass p-5 rounded-2xl">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Activity size={14} /> Total Dispatches
            </div>
            <div className="text-3xl font-display font-bold text-red-400">{totalIncidents}</div>
          </div>
          <div className="glass p-5 rounded-2xl">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Route size={14} /> Avg Case Dist (km)
            </div>
            <div className="text-3xl font-display font-bold text-yellow-400">{avgDistance}</div>
          </div>
          <div className="glass p-5 rounded-2xl">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <MessageSquareWarning size={14} /> Total Chat Sessions
            </div>
            <div className="text-3xl font-display font-bold text-teal-400">{totalSessions}</div>
          </div>
          <div className="glass p-5 rounded-2xl">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldAlert size={14} /> Crisis Flags Activated
            </div>
            <div className="text-3xl font-display font-bold text-[#ff4757]">{totalCrisisMessages}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Emergency Graph Search Records */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2 text-white/90">
              <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <Hospital size={16} />
              </span>
              Emergency Path Histories
            </h2>
            <div className="glass rounded-2xl overflow-hidden flex-1 border border-white/5 bg-[#050810]/60 max-h-[600px] overflow-y-auto custom-scrollbar">
              <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <p className="text-xs text-slate-400">Showing recent 50 algorithmic dispatches.</p>
              </div>
              <div className="divide-y divide-white/5">
                {incidents.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-sm">No emergency dispatches recorded yet.</div>
                )}
                {incidents.map((incident) => (
                  <div key={incident.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${incident.serviceType === 'ambulance' ? 'bg-red-500/20 text-red-400' : incident.serviceType === 'police' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {incident.serviceType}
                        </span>
                        <span className="badge badge-purple px-2 py-0.5 text-[10px] font-mono">
                          {incident.algorithm.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(incident.createdAt).toLocaleString(undefined, {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-slate-300">
                      <span className="font-semibold text-white/80">{incident.sourceLabel}</span>
                      <span className="mx-2 text-slate-500">→</span>
                      <span className="font-semibold text-white/80">{incident.destLabel}</span>
                    </div>
                    <div className="mt-2 flex gap-4 text-xs text-slate-400 font-mono">
                      <span>Dist: {incident.distanceKm} km</span>
                      <span>ETA: {incident.etaMinutes} min</span>
                      <span>Nodes: {incident.nodesExplored}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mental Wellness NLP Records */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2 text-white/90">
              <span className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
                <MessageSquareWarning size={16} />
              </span>
              Wellness Chat Contexts
            </h2>
            <div className="glass rounded-2xl overflow-hidden flex-1 border border-white/5 bg-[#050810]/60 max-h-[600px] overflow-y-auto custom-scrollbar">
              <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <p className="text-xs text-slate-400">Showing recent 50 conversation sessions.</p>
              </div>
              <div className="divide-y divide-white/5">
                {chatSessions.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-sm">No chat sessions recorded yet.</div>
                )}
                {chatSessions.map((session) => {
                  const hasCrisis = session.messages.some((m) => m.isCrisis);
                  const msgCount = session.messages.length;
                  const firstUserMsg = session.messages.find(m => m.role === 'user')?.content || "No user input.";
                  
                  return (
                    <div key={session.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${hasCrisis ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-teal-500/10 text-teal-400'}`}>
                            {hasCrisis ? 'CRISIS DETECTED' : 'STANDARD'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                          {new Date(session.createdAt).toLocaleString(undefined, {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
                      </div>
                      <div className="text-sm text-slate-300 line-clamp-2 italic border-l-2 border-white/10 pl-3 mb-2">
                        "{firstUserMsg}"
                      </div>
                      <div className="flex gap-4 text-xs text-slate-400 font-mono">
                        <span>Messages: {msgCount}</span>
                        <span>
                          Avg Sentiment: {
                            (session.messages.filter(m => m.sentimentScore !== null).reduce((acc, curr) => acc + (curr.sentimentScore || 0), 0) / Math.max(1, session.messages.filter(m => m.sentimentScore !== null).length)).toFixed(2)
                          }
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
