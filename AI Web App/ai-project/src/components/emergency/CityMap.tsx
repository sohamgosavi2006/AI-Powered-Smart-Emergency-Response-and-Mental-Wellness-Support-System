"use client";

import { useEffect, useRef, useState } from "react";
import { NODES, EDGES_RAW } from "@/lib/graph";
import { SearchResult, AnimFrame } from "@/types";

interface CityMapProps {
  onNodeSelect: (id: string) => void;
  result: SearchResult | null;
  selectedNode: string | null;
  onAnimationEnd?: () => void;
}

export default function CityMap({ onNodeSelect, result, selectedNode, onAnimationEnd }: CityMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animState, setAnimState] = useState<{ open: Set<string>; closed: Set<string>; current: string | null; pathSoFar: string[] | null } | null>(null);

  useEffect(() => {
    if (!result || !result.frames.length) {
      setAnimState(null);
      if (result) onAnimationEnd?.();
      return;
    }

    let step = 0;
    const frames = result.frames;
    const delay = Math.max(80, 500 / frames.length);

    const interval = setInterval(() => {
      if (step >= frames.length) {
        clearInterval(interval);
        setAnimState({ open: new Set(), closed: new Set(), current: null, pathSoFar: result.path });
        onAnimationEnd?.();
        return;
      }
      const frame = frames[step];
      setAnimState({
        open: new Set(frame.open),
        closed: new Set(frame.closed),
        current: frame.current,
        pathSoFar: null,
      });
      step++;
    }, delay);

    return () => clearInterval(interval);
  }, [result]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      W = canvas.width = parent.clientWidth;
      H = canvas.height = Math.max(parent.clientHeight, 400);
      draw();
    };
    resize();
    window.addEventListener("resize", resize);

    function px(node: { x: number; y: number }) {
      // Ensure we maintain a nice margin padding from edges (0.05 scaling mapped)
      return { x: node.x * W, y: node.y * H };
    }

    function draw() {
      if (!ctx || W === 0 || H === 0) return;
      ctx.clearRect(0, 0, W, H);
      
      // Dynamic bright premium background
      const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H));
      bgGrad.addColorStop(0, "#ffffff");
      bgGrad.addColorStop(1, "#f1f5f9"); // High-end light slate 50
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Tech Grid Background (Slate)
      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)"; // Slate 400
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Intersections
      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      for (let x = 0; x < W; x += 40) {
        for (let y = 0; y < H; y += 40) {
          ctx.beginPath(); ctx.rect(x - 1, y - 1, 2, 2); ctx.fill();
        }
      }

      // Edges
      EDGES_RAW.forEach(([a, b, w]) => {
        const pa = px(NODES[a]), pb = px(NODES[b]);
        ctx.save();
        ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.font = "bold 13px var(--font-inter)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Background Pill for Edge weights
        const text = w + "km";
        const tw = ctx.measureText(text).width;
        
        ctx.shadowColor = "rgba(0,0,0,0.06)";
        ctx.shadowBlur = 4;
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect((pa.x + pb.x) / 2 - tw/2 - 6, (pa.y + pb.y) / 2 - 12, tw + 12, 24, 12);
        } else {
            ctx.rect((pa.x + pb.x) / 2 - tw/2 - 6, (pa.y + pb.y) / 2 - 12, tw + 12, 24);
        }
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(203, 213, 225, 1)"; // slate 300
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.fillStyle = "#334155"; // Clear dark slate 700 text
        ctx.fillText(text, (pa.x + pb.x) / 2, (pa.y + pb.y) / 2);
        ctx.restore();
      });

      // Path connection
      if (animState?.pathSoFar && animState.pathSoFar.length > 1) {
        const path = animState.pathSoFar;
        ctx.save();
        ctx.lineWidth = 6;
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        const pa = px(NODES[path[0]]), pb = px(NODES[path[path.length - 1]]);
        
        ctx.shadowColor = "rgba(255, 71, 87, 0.3)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 4;

        // Path gradient overrides bright background perfectly
        const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
        grad.addColorStop(0, "#ff4757");
        grad.addColorStop(0.5, "#a29bfe");
        grad.addColorStop(1, "#00d2d3");
        
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(px(NODES[path[0]]).x, px(NODES[path[0]]).y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(px(NODES[path[i]]).x, px(NODES[path[i]]).y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Nodes
      const pathSet = new Set(animState?.pathSoFar || (result && !animState ? result.path : []));
      const goal = result && !animState ? result.goal : null;

      Object.entries(NODES).forEach(([id, node]) => {
        const { x, y } = px(node);
        const isSource = id === selectedNode;
        const isGoal = id === goal;
        const inPath = pathSet.has(id);
        const inOpen = animState?.open.has(id);
        const inClosed = animState?.closed.has(id);
        const isCur = id === animState?.current;

        ctx.save();
        
        let r = node.type === "area" ? 14 : 16;
        if (isSource || isGoal || isCur) r += 5;

        // Outer rings (Drop shadows mapped for strict light UI)
        if (isSource || isGoal || isCur || inPath) {
          ctx.beginPath();
          ctx.arc(x, y, r + 8, 0, Math.PI * 2);
          if (isSource) ctx.fillStyle = "rgba(255, 71, 87, 0.1)";
          else if (isGoal) ctx.fillStyle = "rgba(0, 210, 211, 0.1)";
          else if (isCur) ctx.fillStyle = "rgba(255, 211, 42, 0.15)";
          else ctx.fillStyle = "rgba(162, 155, 254, 0.1)";
          ctx.fill();
        }

        // Heavy dark drop-shadow for elevation
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)"; 
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;

        // Closed set marking
        if (inClosed && !isSource && !isGoal && !inPath) {
          ctx.beginPath(); ctx.arc(x, y, r + 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(203, 213, 225, 0.8)"; // Light slate
          ctx.fill();
        }

        // Inner circle
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        
        const colors = { area: "#ffffff", hospital: "#ffd32a", police: "#63b3ed", fire: "#fc8c03" };
        if (isSource) ctx.fillStyle = "#ff4757";
        else if (isGoal) ctx.fillStyle = "#00d2d3";
        else if (inPath) ctx.fillStyle = "#00d2d3";
        else if (isCur) ctx.fillStyle = "#ffd32a";
        else if (inOpen) ctx.fillStyle = "#a29bfe";
        else ctx.fillStyle = colors[node.type] || "#ffffff";

        ctx.fill();
        
        // Node border
        ctx.strokeStyle = (isSource||isGoal||isCur||inPath) ? "#ffffff" : "#cbd5e1"; // slate 300
        ctx.lineWidth = (isSource||isGoal||isCur) ? 2 : 1.5; 
        ctx.stroke();
        ctx.restore();

        // Icon
        ctx.font = `${r * 1.05}px serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(node.icon, x, y);

        // Label Background
        ctx.font = "bold 11px var(--font-inter)";
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        const label = node.label.length > 14 ? node.label.slice(0, 12) + "…" : node.label;
        const tw = ctx.measureText(label).width + 12;
        
        // Deep shadow for contrast
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x - tw / 2, y + r + 6, tw, 20, 6);
        } else {
            ctx.rect(x - tw / 2, y + r + 6, tw, 20);
        }
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.strokeStyle = (isSource||isGoal||inPath) ? "rgba(0,0,0,0.1)" : "rgba(148, 163, 184, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = "#0f172a"; // Deep slate readable text
        ctx.fillText(label, x, y + r + 10);
      });
    }

    draw();

    const handleClick = (e: MouseEvent) => {
      if (animState && !animState.pathSoFar) return; // animating
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;

      let best: string | null = null, bestD = Infinity;
      Object.entries(NODES).forEach(([id, node]) => {
        const { x, y } = px(node);
        const d = Math.hypot(mx - x, my - y);
        if (d < bestD) { bestD = d; best = id; }
      });

      if (bestD < 30 && best) onNodeSelect(best);
    };

    canvas.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", handleClick);
    };
  }, [selectedNode, result, animState, onNodeSelect]);

  return <canvas ref={canvasRef} className="w-full h-full cursor-crosshair block min-h-[400px]" />;
}
