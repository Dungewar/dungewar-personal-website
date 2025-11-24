"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askAI = askAI;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
async function askAI(prompt) {
    console.log("Asking Gemini: ", prompt);
    const result = await model.generateContent(prompt);
    console.log("Response received: ", result.response.text());
    return result;
}
//# sourceMappingURL=aiHandler.js.map