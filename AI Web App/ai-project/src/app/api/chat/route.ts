import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

// Weighted sentiment lexicon (simplified version of the client-side one, purely to log sentiment in DB quickly)
const LEXICON: Record<string, number> = {
  happy: 0.9, joyful: 1.0, amazing: 0.95, great: 0.85, excited: 0.85, 
  calm: 0.75, okay: 0.35, fine: 0.5,
  sad: -0.8, anxiety: -0.85, stress: -0.75, angry: -0.8, tired: -0.6,
  lonely: -0.8, overwhelmed: -0.85, terrible: -0.85,
  "kill myself": -1.0, suicide: -1.0, die: -0.9
};

const CRISIS_WORDS = ["kill myself", "suicide", "die", "hurt myself", "end my life"];

function basicSentiment(text: string) {
  const lower = text.toLowerCase();
  const isCrisis = CRISIS_WORDS.some((c) => lower.includes(c));
  
  let score = 0, count = 0;
  const words = lower.replace(/[^a-z0-9\s]/g, "").split(/\s+/);
  
  words.forEach(w => {
    if (LEXICON[w]) { score += LEXICON[w]; count++; }
  });

  let finalScore = count > 0 ? score / count : 0;
  if (isCrisis) finalScore = -1.0;

  let label = "Neutral 😐";
  if (isCrisis) label = "🆘 Crisis";
  else if (finalScore >= 0.4) label = "😊 Positive";
  else if (finalScore <= -0.4) label = "😟 Negative";
  
  return { score: finalScore, isCrisis, label };
}

export async function POST(req: Request) {
  try {
    const { message, sessionId, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 1. Calculate basic sentiment & save user msg
    const { score, isCrisis, label } = basicSentiment(message);
    
    let activeSessionId = sessionId;
    if (!activeSessionId) {
      const sess = await prisma.chatSession.create({ data: {} });
      activeSessionId = sess.id;
    }

    await prisma.chatMessage.create({
      data: {
        sessionId: activeSessionId,
        role: "user",
        content: message,
        sentimentScore: score,
        emotionLabel: label,
        isCrisis,
      }
    });

    // 2. Call Gemini API
    const reply = await generateChatResponse(message, history);

    // 3. Save assistant reply
    await prisma.chatMessage.create({
      data: {
        sessionId: activeSessionId,
        role: "assistant",
        content: reply,
      }
    });

    return NextResponse.json({
      reply,
      sessionId: activeSessionId,
      sentiment: { score, isCrisis, emotionLabel: label }
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
