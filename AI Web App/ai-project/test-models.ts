import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDZr_AAo_2SjtxGQUzUNzliBXjDIG6eAbM";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log("AVAILABLE MODELS:");
    console.log(data.models?.map((m: any) => m.name) || data);
  } catch (e) {
    console.log("ERROR", e);
  }
}
run();
