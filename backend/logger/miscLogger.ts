import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const miscLogger = (req: Request, res: Response): void => {
    logMessage(`${req.method} ${req.url}`);
    res.status(200).send('Logged!');
}

const logDir = "/srv/dungewar-personal-website/logs";
const logFile = path.join(logDir, 'logsRoute.log');

// Make sure the logs directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Append a log line
export function logMessage(message: string) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFile, logLine, 'utf8');
}