import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const emailListSubscribe = (req: Request, res: Response): void => {
    logMessage(`${req.body.email}`);
    res.status(200).send('Added to email list!');
}

const logDir = "/srv/dungewar-personal-website-data/data/";
const logFile = path.join(logDir, 'updateEmailSubscription.txt');

// Make sure the logs directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Append a log line
function logMessage(message: string) {
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp} ${message}\n`;
    fs.appendFileSync(logFile, logLine, 'utf8');
}