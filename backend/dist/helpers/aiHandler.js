"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askAI = askAI;
const generative_ai_1 = require("@google/generative-ai");
const numberManipulation_1 = require("./numberManipulation");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
let lastCall = Date.now();
const DELAY = 5000;
// TODO: fix later
async function askAI(prompt) {
    // lastCall = Date.now();
    // const result = await setTimeout(async () => {
    //   return await model.generateContent(prompt);
    // }, clamp(timeDelay, 0, DELAY));
    // console.log("Response received: ", result.response.text());
    // return result;
    const timeBetweenRequests = (0, numberManipulation_1.clamp)(Date.now() - lastCall, 0, 9999999);
    if (timeBetweenRequests < DELAY) {
        // wait for some time
        // setTimeout(() => {}, DELAY-timeBetweenRequests);
    }
    return await model.generateContent(prompt);
}
//# sourceMappingURL=aiHandler.js.map