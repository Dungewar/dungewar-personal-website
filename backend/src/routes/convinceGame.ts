import { Request, Response } from 'express';
import { logMessageFile } from "../helpers/fileHandler";
import { askAI } from '../helpers/aiHandler';

interface RequestBody {
    message?: string;
    fileName?: string;
    pastMessages?: string;
}

export const convinceGameHandler = (req: Request, res: Response): void => {
    console.log("Convince game request received.");

    const body = req.body as RequestBody;

    // const message = JSON.stringify({
    //     method: req.method,
    //     url: req.originalUrl,
    //     ip: req.ip,
    //     headers: req.headers,
    //     body: req.body,
    // });
    if (
        !body || // Check if body itself is missing
        body.message === undefined ||
        body.fileName === undefined ||
        body.pastMessages === undefined
    ) {
        res.status(400).send({ error: 'Bad Request: message field and fileName and pastMessages is required in the body' });
        return;
    }
    console.log("Message: ", req.body.message, "\nFile name: ", req.body.fileName);

    let attempts = 0;
    while (++attempts < 3) {
        try {
            askAI("You will provide a JSON response for a convince game. The response should have the following format: {\"message\": string, \"convincement\": int}.\n" +
                "The messsage is a short text responding to the user, up to 200 characters. The convincement is an integer from 1 to 10 indicating how convincing the message is.\n" +
                "Make sure the convincement is appropriate to the message content. A score of 5 means the response is nether convincing nor unconvincing (for example \"hello there!\"). 10 means you're pretty certain that it's a good idea to return. 1 means that the message makes you not think the file was important.\n" +
                "Respond only with the JSON object, no additional text. Do NOT include ```json or otherwise any markdown formatting.\n" +
                "The thing that they are trying to convince you of is why their file should be returned to them. The file was taken away for a good reason, but you don't know what that reason is.\n" +
                "Very strictly judge the grammar and punctuation of the message, but don't be strict about the content. Their messages need to provide unique points, not just repeats of previous arguments.\n" +
                "Here is the user's message: " + req.body.message +
                "\nHere is the user's file name, make sure it matches their story (point out if they lie about its name): " + req.body.fileName +
                "\nHere are past messages exchanged in this convince game: " + req.body.pastMessages
            ).then((aiResponse) => {
                logMessageFile('convince-game.log', `User message: ${req.body}\nAI response: ${aiResponse.response.text()}\n`);
                // This it to verify that the AI sent a valid JSON
                const parsedResponse = JSON.parse(aiResponse.response.text());
                res.status(200).send(JSON.stringify(
                    parsedResponse
                ));
                return;
            });
        } catch (error) {
            console.error("Error in convinceGameHandler: ", error);
            if (error instanceof SyntaxError) {
                console.log("Caught JSON parsing error: ", error.message);
                console.log("Retrying the AI request...");
                continue; // Retry on JSON parsing errors
            }
            else {
                res.status(500).send({ error: 'Internal Server Error' });
                return;
            }
        }
    }
};
