"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMessageFile = logMessageFile;
exports.logErrorFile = logErrorFile;
exports.logMessage = logMessage;
exports.logError = logError;
exports.readDataFile = readDataFile;
exports.appendDataFile = appendDataFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LOG_DIR = '/srv/dungewar-personal-website-data/website-data/logs/';
const DATA_DIR = '/srv/dungewar-personal-website-data/website-data/data/';
fs_1.default.mkdirSync(path_1.default.dirname(LOG_DIR), { recursive: true });
const timestamp = () => {
    return new Date().toISOString();
};
const logPrefix = () => {
    return `[MSG] [${timestamp()}] `;
};
const errorPrefix = () => {
    return `[ERR] [${timestamp()}] `;
};
function logMessageFile(file, msg) {
    const LOG_FILE = path_1.default.join(LOG_DIR, file);
    msg = `${logPrefix()}${msg}\n`;
    console.log(msg);
    fs_1.default.appendFileSync(LOG_FILE, msg);
}
function logErrorFile(file, msg) {
    const LOG_FILE = path_1.default.join(LOG_DIR, file);
    msg = `${errorPrefix()}${msg}\n`;
    console.error(msg);
    fs_1.default.appendFileSync(LOG_FILE, msg);
}
function logMessage(msg) {
    msg = `${logPrefix()}${msg}`;
    console.log(msg);
}
function logError(msg) {
    msg = `${errorPrefix()}${msg}`;
    console.error(msg);
}
/**
 * Returns the entire contents of a file in utf8
 * @param file The file to read, just file no directory, the directory is automatically at /website-data/data
 */
function readDataFile(file) {
    const DATA_FILE = path_1.default.join(DATA_DIR, file);
    return fs_1.default.readFileSync(DATA_FILE, 'utf8');
}
/**
 * Appends message to data file
 * @param file The file to append to
 * @param msg The message to add
 */
function appendDataFile(file, msg) {
    const DATA_FILE = path_1.default.join(DATA_DIR, file);
    fs_1.default.appendFileSync(DATA_FILE, 'msg');
}
//# sourceMappingURL=fileHandler.js.map