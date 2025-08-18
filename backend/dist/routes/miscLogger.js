import fs from 'fs';
import path from 'path';
export const miscLogger = (req, res) => {
    logMessage(`${req.method} ${req.url}`);
    res.status(200).send('Logged!');
};
const logDir = "/srv/dungewar-personal-website-data/logs/";
const logFile = path.join(logDir, 'logs-route.log');
// Make sure the logs directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
// Append a log line
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFile, logLine, 'utf8');
}
//# sourceMappingURL=miscLogger.js.map