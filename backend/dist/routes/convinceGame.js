"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convinceGameHandler = void 0;
const fileHandler_1 = require("../helpers/fileHandler");
const aiHandler_1 = require("../helpers/aiHandler");
const convinceGameHandler = (req, res) => {
    console.log("Convince game request received.");
    const body = req.body;
    // const message = JSON.stringify({
    //     method: req.method,
    //     url: req.originalUrl,
    //     ip: req.ip,
    //     headers: req.headers,
    //     body: req.body,
    // });
    if (!body || // Check if body itself is missing
        body.message === undefined ||
        body.fileName === undefined ||
        body.pastMessages === undefined) {
        res.status(400).send({ error: 'Bad Request: message field and fileName and pastMessages is required in the body' });
        return;
    }
    console.log("Message: ", req.body.message, "\nFile name: ", req.body.fileName);
    try {
        (0, aiHandler_1.askAI)("You will provide a JSON response for a convince game. The response should have the following format: {\"message\": string, \"convincement\": int}.\n" +
            "The messsage is a short text responding to the user, up to 100 characters. The convincement is an integer from 1 to 10 indicating how convincing the message is.\n" +
            "Make sure the convincement is appropriate to the message content.\n" +
            "Respond only with the JSON object, no additional text. Do NOT include ```json or otherwise any markdown formatting.\n" +
            "The thing that they are trying to convince you of is why their file should be returned to them. The file was taken away for a good reason, but you don't know what that reason is.\n" +
            "Make sure to judge the gramar and flow of their message in addition to the content. Their messages need to provide unique points, not just repeats.\n" +
            "Here is the user's message: " + req.body.message +
            "\nHere is the user's file name, make sure it matches their story: " + req.body.fileName +
            "\nHere are past messages exchanged in this convince game: " + req.body.pastMessages).then((aiResponse) => {
            (0, fileHandler_1.logMessageFile)('convince-game.log', `User message: ${req.body}\nAI response: ${aiResponse.response.text()}\n`);
            // This it to verify that the AI sent a valid JSON
            const parsedResponse = JSON.parse(aiResponse.response.text());
            res.status(200).send(JSON.stringify(parsedResponse));
        });
    }
    catch (error) {
        console.error("Error in convinceGameHandler: ", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.convinceGameHandler = convinceGameHandler;
//# sourceMappingURL=convinceGame.js.map