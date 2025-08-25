import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';

const logDir = "/srv/dungewar-personal-website-data/logs/";

const logFile = path.join(logDir, 'logs-route.log');
// Make sure the logs directory exists

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
export const miscLogger = (req: Request, res: Response): void => {
    const timestamp = new Date().toISOString();


    const message = JSON.stringify({
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
        body: req.body,
    });


    const logLine = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFile, logLine, 'utf8');
    res.status(200).send('Logged!');
}
