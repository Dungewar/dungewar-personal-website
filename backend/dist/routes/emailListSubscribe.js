"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailListSubscribe = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const emailListSubscribe = (req, res) => {
    logMessage(`${req.body.email}`);
    res.status(200).send('Added to email list!');
};
exports.emailListSubscribe = emailListSubscribe;
const logDir = "/srv/dungewar-personal-website-data/data/";
const logFile = path_1.default.join(logDir, 'updateEmailSubscription.txt');
// Make sure the logs directory exists
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
// Append a log line
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp} ${message}\n`;
    fs_1.default.appendFileSync(logFile, logLine, 'utf8');
}
//# sourceMappingURL=emailListSubscribe.js.map