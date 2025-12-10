import { GoogleGenerativeAI } from "@google/generative-ai";
import { clamp } from "./numberManipulation";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

let lastCall = Date.now();
const DELAY = 5000;

// TODO: fix later
export async function askAI(prompt: string) {
  // lastCall = Date.now();
  // const result = await setTimeout(async () => {
  //   return await model.generateContent(prompt);
  // }, clamp(timeDelay, 0, DELAY));
  // console.log("Response received: ", result.response.text());
  // return result;
  const timeBetweenRequests = clamp(Date.now() - lastCall, 0, 9999999);
  if (timeBetweenRequests < DELAY) {
    // wait for some time
    // setTimeout(() => {}, DELAY-timeBetweenRequests);
  }
  return await model.generateContent(prompt);
}