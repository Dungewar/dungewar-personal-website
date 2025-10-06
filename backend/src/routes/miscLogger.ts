import { Request, Response } from 'express';
import {logMessageFile} from "../helpers/fileHandler";

export const miscLogger = (req: Request, res: Response): void => {
    const message = JSON.stringify({
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
        body: req.body,
    });

    logMessageFile('logs-route.log', message);
    res.status(200).send('Logged!');
}
