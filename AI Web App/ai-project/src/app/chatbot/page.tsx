"use client";

import { useState, useRef, FormEvent } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import ChatWindow from "@/components/chatbot/ChatWindow";
import SentimentMeter from "@/components/chatbot/SentimentMeter";
import { ChatMessageType, SentimentResult } from "@/types";
import { Brain, Send } from "lucide-react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentSentiment, setCurrentSentiment] = useState<SentimentResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Build history for Gemini
    const history = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, sessionId, history }),
      });
      const data = await res.json();
      
      if (data.sessionId) setSessionId(data.sessionId);
      if (data.sentiment) {
        setCurrentSentiment(data.sentiment);
        // Update user message with sentiment
        setMessages(prev => prev.map(m => 
          m.id === userMsg.id 
            ? { ...m, sentimentScore: data.sentiment.score, emotionLabel: data.sentiment.emotionLabel, isCrisis: data.sentiment.isCrisis } 
            : m
        ));
      }

      const botMsg: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const insertHint = (hint: string) => {
    setInput(hint);
    textareaRef.current?.focus();
  };

  return (
    <>
      <ParticleBackground />
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 animate-fade-in relative z-10">
        
        {/* Main Chat App */}
        <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
          <div className="flex-1 flex flex-col glass overflow-hidden border-teal-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-teal-500/30 bg-teal-500/10 flex items-center justify-center text-xl shrink-0">
                  🧠
                </div>
                <div>
                  <h2 className="font-bold text-sm">MindAI Counsellor</h2>
                  <div className="flex items-center gap-1.5 text-[11px] text-teal-400 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#00d2d3] animate-pulse" />
                    Powered by Gemini 1.5 Flash
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="badge badge-teal">Gemini LLM</span>
                <span className="badge badge-purple">NLP Engine</span>
              </div>
            </div>

            {/* Messages Area */}
            <ChatWindow messages={messages} isTyping={isTyping} />

            {/* Input Area */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5">
              <form onSubmit={handleSend} className="relative flex items-end gap-3">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type how you're feeling..."
                  className="w-full bg-white/5 border border-white/10 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none resize-none min-h-[50px] max-h-[120px] transition-all"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-[50px] h-[50px] rounded-xl bg-teal-500 hover:bg-teal-400 text-[#050810] flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {["😟 I'm anxious", "😔 Feeling sad today", "😠 Very stressed", "😊 I feel great!", "😴 Can't sleep"].map(h => (
                  <button 
                    key={h} 
                    onClick={() => insertHint(h.replace(/^[^\s]+\s/,""))}
                    className="px-3 py-1 bg-white/5 hover:bg-teal-500/10 border border-white/10 hover:border-teal-500/30 rounded-full text-[11px] text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-5 overflow-y-auto pr-2">
          <SentimentMeter sentiment={currentSentiment} />
          
          <div className="glass p-5">
             <h4 className="font-display font-bold text-sm text-[#00d2d3] mb-3 flex items-center gap-2">🧠 Gemini 1.5 LLM</h4>
             <div className="bg-black/30 border-l-2 border-[#00d2d3] px-3 py-2 font-mono text-sm text-[#00d2d3] mb-3 text-center rounded">
               Lang Agent
             </div>
             <p className="text-xs text-slate-400 leading-relaxed mb-3">
               Large Language Models are capable of understanding, summarizing, generating, and predicting new content, primarily text and code.
             </p>
             <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
               <li>Tokenizes user input</li>
               <li>Checks against NLP lexicon</li>
               <li>Passes context to Gemini LLM</li>
               <li>Bot replies empathetically</li>
             </ul>
          </div>
        </div>

      </div>
    </>
  );
}
