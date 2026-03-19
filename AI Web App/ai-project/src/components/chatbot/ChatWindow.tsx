"use client";

import { useEffect, useRef } from "react";
import { ChatMessageType } from "@/types";

interface ChatWindowProps {
  messages: ChatMessageType[];
  isTyping: boolean;
}

export default function ChatWindow({ messages, isTyping }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
      {messages.length === 0 && !isTyping && (
        <div className="text-center text-slate-500 text-sm mt-10">
          Send a message to start chatting with MindAI.
        </div>
      )}

      {messages.map((msg) => {
        const isUser = msg.role === "user";
        
        return (
          <div key={msg.id} className={`flex gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 ${isUser ? "bg-red-500/20 border border-red-500/30 text-lg" : "bg-teal-500/20 border border-teal-500/30 text-xl"}`}>
              {isUser ? "😊" : "🧠"}
            </div>

            {/* Bubble & Meta */}
            <div className={`max-w-[80%] flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
              <div 
                className={`py-3 px-4 rounded-[20px] text-[15px] leading-relaxed break-words ${
                  isUser 
                    ? "bg-gradient-to-br from-red-500/25 to-red-500/10 border border-red-500/30 rounded-br-sm text-white" 
                    : "bg-white/5 border border-white/10 rounded-bl-sm text-slate-200"
                }`}
              >
                {msg.content.split("\n").map((line, i) => <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>)}
              </div>
              
              <div className={`flex items-center gap-2 text-[11px] text-slate-500 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                
                {msg.emotionLabel && (
                  <span className={`px-2 py-0.5 rounded-full border ${
                    msg.isCrisis 
                      ? "bg-orange-500/10 text-orange-500 border-orange-500/30 animate-pulse"
                      : msg.sentimentScore! >= 0.4
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : msg.sentimentScore! <= -0.4
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-purple-500/10 text-[#a29bfe] border-purple-500/30"
                  }`}>
                    {msg.emotionLabel} ({msg.sentimentScore?.toFixed(2)})
                  </span>
                )}
              </div>
              
              {/* Crisis Card Injection */}
              {isUser && msg.isCrisis && (
                <div className="mt-2 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 w-full max-w-sm animate-fade-in text-left">
                  <h4 className="font-bold text-orange-500 text-sm mb-3 flex items-center gap-2">🆘 Crisis Support — Please Reach Out</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-orange-500/20 pb-1">
                      <span className="text-slate-300">iCall (India)</span>
                      <strong className="text-orange-400">9152987821</strong>
                    </div>
                    <div className="flex justify-between border-b border-orange-500/20 pb-1">
                      <span className="text-slate-300">Vandrevala</span>
                      <strong className="text-orange-400">1860-2662-345</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Crisis Text Line</span>
                      <strong className="text-orange-400">Text HOME to 741741</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {isTyping && (
        <div className="flex gap-3 animate-fade-in">
          <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 mt-1 text-xl">🧠</div>
          <div className="py-4 px-5 rounded-[20px] rounded-bl-sm bg-white/5 border border-white/10 flex gap-1.5 items-center w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-[blink_1s_infinite_0ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-[blink_1s_infinite_200ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-[blink_1s_infinite_400ms]" />
          </div>
        </div>
      )}
    </div>
  );
}
