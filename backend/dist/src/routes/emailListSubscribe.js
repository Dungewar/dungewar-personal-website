import fs from 'fs';
import path from 'path';
export const emailListSubscribe = (req, res) => {
    logMessage(`${req.body}`);
    res.status(200).send('Added to email list!');
};
const logDir = "/srv/dungewar-personal-website-data/data/";
const logFile = path.join(logDir, 'updateEmailSubscription.txt');
// Make sure the logs directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
// Append a log line
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp} ${message}\n`;
    fs.appendFileSync(logFile, logLine, 'utf8');
}
//# sourceMappingURL=emailListSubscribe.js.map