"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailListSubscribe = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logDir = "/srv/dungewar-personal-website-data/data/";
const logFile = path_1.default.join(logDir, 'email-subscriptions-updates.txt');
// Make sure the logs directory exists
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
const emailListSubscribe = (req, res) => {
    const existingEmails = fs_1.default.readFileSync(path_1.default.join(logDir, 'emailListSubscribe.json'), 'utf8');
    const lines = existingEmails.split("\n");
    for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts[1].trim() === req.body.email.trim()) {
            res.status(201).send('Email address already exists');
            return;
        }
    }
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp} ${req.body.email} ${req.ip}\n`;
    fs_1.default.appendFileSync(logFile, logLine, 'utf8');
    res.status(200).send('Added to email list!');
    return;
};
exports.emailListSubscribe = emailListSubscribe;
//# sourceMappingURL=emailListSubscribe.js.map