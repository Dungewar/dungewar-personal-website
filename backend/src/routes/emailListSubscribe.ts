import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {readFile} from "node:fs";
import {logErrorFile, logMessageFile, readDataFile} from "../helpers/fileHandler";

const EMAIL_FILE = 'email-subscriptions-updates.txt';
const LOG_FILE = 'email-list-subscribe.log';

export const emailListSubscribe = (req: Request, res: Response): void => {


    if(!req || !req.body || !req.body.email) {
        logMessageFile(LOG_FILE, `Received malformed email request`);
        res.status(400).send("Malformed request, missing request, body, or email");
    }
    const email = req.body.email;

    const existingEmails = readDataFile(EMAIL_FILE);
    logMessageFile(LOG_FILE, "Received request to add email: " + email);

    const lines = existingEmails.split("\n");
    for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if(parts.length > 1 && parts[1].trim() === email.trim()) {
            logMessageFile(LOG_FILE, "Email already exists in file, not saving it");
            res.status(201).send('Email address already exists');
            return;
        }
    }

    logMessageFile(LOG_FILE, "Adding new email address: " + email);
    res.status(200).send(`Added ${email} belonging to ${req.ip} to email list!`);
    return;
}



