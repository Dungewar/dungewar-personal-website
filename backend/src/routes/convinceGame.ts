import { Request, Response } from 'express';
import { logMessageFile } from "../helpers/fileHandler";
import { askAI } from '../helpers/aiHandler';

export const convinceGameHandler = (req: Request, res: Response): void => {
    const message = JSON.stringify({
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
        body: req.body,
    });

    try {
        askAI("You will provide a JSON response for a convince game. The response should have the following format: {\"message\": string, \"convincement\": int}." +
            "The messsage is a short text responding to the user, up to 100 characters. The convincement is an integer from 1 to 10 indicating how convincing the message is." +
            "Make sure the convincement is appropriate to the message content." +
            "Respond only with the JSON object, no additional text." +
            "The thing that they are trying to convince you of is why their file should be returned to them. The file was taken away for a good reason, but you don't know what that reason is." +
            "Make sure to judge the gramar and flow of their message in addition to the content." +
            "Here is the user's message: " + message
        ).then((aiResponse) => {
            logMessageFile('convince-game.log', `User message: ${message}\nAI response: ${aiResponse}\n`);
            res.status(200).send(JSON.stringify(
                JSON.parse(aiResponse.response.text())
            ));
        });
    } catch (error) {
        console.error("Error in convinceGameHandler: ", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}
