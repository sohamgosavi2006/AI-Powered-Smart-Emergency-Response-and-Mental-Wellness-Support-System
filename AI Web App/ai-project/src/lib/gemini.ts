// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateChatResponse(message: string, history: {role: string, parts: {text: string}[]}[] = []) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "dummy_key") {
       throw new Error("Missing or dummy Gemini API Key");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are MindAI, a supportive, empathetic AI counsellor for university students facing stress, academic pressure, and mental health challenges. You use NLP and AI to provide emotional support. Keep your responses concise (2-4 sentences max), warm, and highly empathetic. If the user mentions self-harm, suicide, or severe crisis, gently but firmly urge them to contact a crisis lifeline immediately.",
    });

    const chat = geminiModel.startChat({
        history: history,
    });
    const result = await chat.sendMessage(message);
    const text = await result.response.text();
    return text || "I couldn't process that, please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting right now, but please know I'm here for you. Take a deep breath. 🌱";
  }
}
