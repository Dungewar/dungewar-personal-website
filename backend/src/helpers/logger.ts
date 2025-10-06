import fs from "fs";
import path from "path";

const LOG_DIR = '/srv/dungewar-personal-website-data/website-data/logs/';
fs.mkdirSync(path.dirname(LOG_DIR), {recursive: true});

const timestamp = () => {return new Date().toISOString()};
const logPrefix = `[MSG] [${timestamp}] `;
const errorPrefix = `[ERR] [${timestamp}] `;

function fileLogMessage(file: string, msg: string) {
    const LOG_FILE = path.join(LOG_DIR, file);
    msg = `${logPrefix}${msg}`;

    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg);
}
function fileLogError(file: string, msg: string) {
    const LOG_FILE = path.join(LOG_DIR, file);
    msg = `${errorPrefix}${msg}`;

    console.error(msg);
    fs.appendFileSync(LOG_FILE, msg);
}
function logMessage(msg: string) {
    msg = `${logPrefix}${msg}`;

    console.log(msg)
}
function logError(msg: string) {
    msg = `${errorPrefix}${msg}`;

    console.error(msg)
}
