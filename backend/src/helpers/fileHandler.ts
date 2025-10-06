import fs from "fs";
import path from "path";

const LOG_DIR = '/srv/dungewar-personal-website-data/website-data/logs/';
const DATA_DIR = '/srv/dungewar-personal-website-data/website-data/data/';
fs.mkdirSync(path.dirname(LOG_DIR), {recursive: true});

const timestamp = () => {
    return new Date().toISOString()
};
const logPrefix = () => {
    `[MSG] [${timestamp}] `
};
const errorPrefix = () => {
    `[ERR] [${timestamp}] `
};

export function logMessageFile(file: string, msg: string) {
    const LOG_FILE = path.join(LOG_DIR, file);
    msg = `${logPrefix}${msg}\n`;

    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg);
}

export function logErrorFile(file: string, msg: string) {
    const LOG_FILE = path.join(LOG_DIR, file);
    msg = `${errorPrefix}${msg}\n`;

    console.error(msg);
    fs.appendFileSync(LOG_FILE, msg);
}

export function logMessage(msg: string) {
    msg = `${logPrefix}${msg}`;

    console.log(msg)
}

export function logError(msg: string) {
    msg = `${errorPrefix}${msg}`;

    console.error(msg)
}

/**
 * Returns the entire contents of a file in utf8
 * @param file The file to read, just file no directory, the directory is automatically at /website-data/data
 */
export function readDataFile(file: string): string {
    const DATA_FILE = path.join(DATA_DIR, file);

    return fs.readFileSync(DATA_FILE, 'utf8');
}