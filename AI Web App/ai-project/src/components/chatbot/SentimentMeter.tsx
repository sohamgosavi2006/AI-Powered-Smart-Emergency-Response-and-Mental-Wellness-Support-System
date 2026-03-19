"use client";

import { SentimentResult } from "@/types";

interface SentimentMeterProps {
  sentiment: SentimentResult | null;
}

export default function SentimentMeter({ sentiment }: SentimentMeterProps) {
  const score = sentiment?.score || 0;
  
  // Convert -1..+1 to 0..100%
  const pct = ((score + 1) / 2) * 100;

  let emoji = "😐";
  let colorClass = "text-[#a29bfe]";
  let fillGradient = "linear-gradient(90deg, #a29bfe, #a29bfe)";
  let fillLeft = "50%";
  let fillWidth = "0%";

  if (score > 0) {
    fillLeft = "50%";
    fillWidth = `${pct - 50}%`;
    fillGradient = "linear-gradient(90deg, #00d2d3, #00ff88)";
    if (score >= 0.4) { emoji = "😊"; colorClass = "text-[#00ff88]"; }
    else { emoji = "🙂"; colorClass = "text-[#00d2d3]"; }
  } else if (score < 0) {
    fillLeft = `${pct}%`;
    fillWidth = `${50 - pct}%`;
    fillGradient = "linear-gradient(90deg, #ff4757, #a29bfe)";
    if (score <= -0.7) { emoji = "😰"; colorClass = "text-[#ff4757]"; }
    else if (score <= -0.4) { emoji = "😢"; colorClass = "text-red-400"; }
    else { emoji = "😟"; colorClass = "text-yellow-400"; }
  }

  if (sentiment?.isCrisis) {
    emoji = "🆘";
    colorClass = "text-orange-500 animate-pulse";
  }

  return (
    <div className="glass p-6">
      <h3 className="font-display font-bold mb-5 flex items-center gap-2">📊 Sentiment Meter</h3>
      
      <div className="text-center mb-3 transition-all duration-300 transform scale-125">
        <span className="text-4xl">{emoji}</span>
      </div>
      
      <div className="text-center mb-6">
        <div className={`font-display text-4xl font-extrabold tracking-tight transition-colors duration-500 ${colorClass}`}>
          {score.toFixed(2)}
        </div>
        <div className="text-sm text-slate-400 mt-1 font-medium">{sentiment?.emotionLabel || "Neutral 😐"}</div>
      </div>

      <div className="relative h-3 bg-white/5 rounded-full border border-white/10 mb-2">
        {/* The colored bar starting from middle */}
        <div 
          className="absolute top-0 h-full rounded-full transition-all duration-500 ease-out" 
          style={{ left: fillLeft, width: fillWidth, background: fillGradient }}
        />
        {/* The needle */}
        <div 
          className="absolute top-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#0d1117] shadow-lg transition-all duration-500 ease-out z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pct}%` }}
        />
      </div>
      
      <div className="flex justify-between text-[11px] font-semibold tracking-wider uppercase text-slate-500">
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>
    </div>
  );
}
