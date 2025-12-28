import { Request, Response } from 'express';
import { addWorldBorder, getLatestWorldBorders, getWorldBorder } from '../helpers/databaseHandler';

interface RequestBody {
    secret?: string;
    size: number;
    duration: number;
}

export const mcWorldBorderHandler = (req: Request, res: Response): void => {
    console.log("World border request or submit received");

    if (req.method === "POST") {
        const body = req.body as RequestBody;

        if (
            !body || // Check if body itself is missing
            body.size === undefined ||
            body.duration === undefined
        ) {
            res.status(400).send({ error: 'Malformed Request: fields missing' });
            return;
        }
        console.log("Received worldborder change request: ", body);

        // Minimal protection but whatever it's funny at least
        if (body.secret === "L did you know gods of death like cheese") {
            console.log("It's a submission for world borders!");
            addWorldBorder(body.size, body.duration);
            res.status(200).send("Added!");
            return;
        }
        res.status(403).send("Invalid secret");
        return;
    } else {
        console.log("It's just a request for world borders");
        const latestBorders = getLatestWorldBorders(2);
        if (!latestBorders || latestBorders.length < 2) {
            res.status(500).send("No worldborders found");
            return;
        }
        res.status(200).send({ "latest_borders": latestBorders });
        return;
    }
};