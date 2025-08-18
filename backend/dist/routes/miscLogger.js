"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.miscLogger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const miscLogger = (req, res) => {
    logMessage(`${req.method} ${req.url}`);
    res.status(200).send('Logged!');
};
exports.miscLogger = miscLogger;
const logDir = "/srv/dungewar-personal-website-data/logs/";
const logFile = path_1.default.join(logDir, 'logs-route.log');
// Make sure the logs directory exists
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
// Append a log line
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    fs_1.default.appendFileSync(logFile, logLine, 'utf8');
}
//# sourceMappingURL=miscLogger.js.map