import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function askAI(prompt: string) {
  return null;
  // console.log("Asking Gemini: ", prompt, "\nAPI Key: ", genAI);
  const result = await model.generateContent(prompt);
  console.log("Response received: ", result.response.text());
  return result;
}