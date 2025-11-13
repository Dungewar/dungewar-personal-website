"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailListSubscribe = void 0;
const fileHandler_1 = require("../helpers/fileHandler");
const EMAIL_FILE = 'email-subscriptions-updates.txt';
const LOG_FILE = 'email-list-subscribe.log';
const emailListSubscribe = (req, res) => {
    if (!req || !req.body || !req.body.email) {
        (0, fileHandler_1.logMessageFile)(LOG_FILE, `Received malformed email request`);
        res.status(400).send("Malformed request, missing request, body, or email");
    }
    const email = req.body.email;
    const existingEmails = (0, fileHandler_1.readDataFile)(EMAIL_FILE);
    (0, fileHandler_1.logMessageFile)(LOG_FILE, "Received request to add email: " + email);
    const lines = existingEmails.split("\n");
    for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length > 1 && parts[1].trim() === email.trim()) {
            (0, fileHandler_1.logMessageFile)(LOG_FILE, "Email already exists in file, not saving it");
            res.status(201).send('Email address already exists');
            return;
        }
    }
    (0, fileHandler_1.logMessageFile)(LOG_FILE, "Adding new email address: " + email);
    res.status(200).send(`Added ${email} belonging to ${req.ip} to email list!`);
    return;
};
exports.emailListSubscribe = emailListSubscribe;
//# sourceMappingURL=emailListSubscribe.js.map