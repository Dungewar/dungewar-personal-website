"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.miscLogger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logDir = "/srv/dungewar-personal-website-data/logs/";
const logFile = path_1.default.join(logDir, 'logs-route.log');
// Make sure the logs directory exists
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
const miscLogger = (req, res) => {
    const timestamp = new Date().toISOString();
    const message = JSON.stringify({
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
        body: req.body,
    });
    const logLine = `[${timestamp}] ${message}\n`;
    fs_1.default.appendFileSync(logFile, logLine, 'utf8');
    res.status(200).send('Logged!');
};
exports.miscLogger = miscLogger;
//# sourceMappingURL=miscLogger.js.map