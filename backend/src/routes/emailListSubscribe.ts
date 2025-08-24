import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';

const logDir = "/srv/dungewar-personal-website-data/data/";
const logFile = path.join(logDir, 'email-subscriptions-updates.txt');

// Make sure the logs directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

export const emailListSubscribe = (req: Request, res: Response): void => {

    const existingEmails = fs.readFileSync(path.join(logDir, 'emailListSubscribe.json'), 'utf8');

    const lines = existingEmails.split("\n");
    for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if(parts[1].trim() === req.body.email.trim()) {
            res.status(201).send('Email address already exists');
            return;
        }
    }


    const timestamp = new Date().toISOString();
    const logLine = `${timestamp} ${req.body.email} ${req.ip}\n`;
    fs.appendFileSync(logFile, logLine, 'utf8');

    res.status(200).send('Added to email list!');
    return;
}



