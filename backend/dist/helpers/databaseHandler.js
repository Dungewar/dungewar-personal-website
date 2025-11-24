"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = addMessage;
exports.getMessage = getMessage;
exports.getAll = getAll;
exports.getGeneratedUsername = getGeneratedUsername;
exports.addGeneratedUsername = addGeneratedUsername;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const databasePath = path_1.default.join('/srv/database/', 'data.db');
const database = new better_sqlite3_1.default(databasePath);
database.exec(`
    CREATE TABLE IF NOT EXISTS messages
    (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        author     TEXT NOT NULL,
        text       TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
`);
const messagePreparation = database.prepare(`
    INSERT INTO messages (author, text)
    VALUES (?, ?)
`);
const getLastMessagePrepare = database.prepare(`
    SELECT *
    FROM messages
    ORDER BY id DESC
    LIMIT ?;
`);
const getAllMessages = database.prepare(`
SELECT id, author, text, created_at
    FROM messages
    ORDER BY id ASC
`);
function addMessage(author, text) {
    messagePreparation.run(author, text);
}
function getMessage(messages) {
    return getLastMessagePrepare.all(messages).reverse();
}
function getAll() {
    return getAllMessages.all();
}
database.exec(`
    CREATE TABLE IF NOT EXISTS users
    (
        id TEXT PRIMARY KEY,
        generatedName TEXT NOT NULL UNIQUE
    )
`);
const getGeneratedUsernamePrepare = database.prepare(`
    SELECT generatedName FROM users WHERE id = ?
`);
const setGeneratedUsernamePrepare = database.prepare(`
    INSERT INTO users (id, generatedName)
    VALUES (?, ?)
`);
function getGeneratedUsername(id) {
    const row = getGeneratedUsernamePrepare.get(id);
    return row?.generatedName ?? null;
}
function addGeneratedUsername(id, name) {
    setGeneratedUsernamePrepare.run(id, name);
}
//# sourceMappingURL=databaseHandler.js.map