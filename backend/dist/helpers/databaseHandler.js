"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = addMessage;
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
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
`);
const getAllMessages = database.prepare(`
  SELECT id, author, text, created_at
  FROM messages
  ORDER BY id ASC
`);
const messagePreparation = database.prepare(`
        INSERT INTO messages (author, text, created_at)
        VALUES (?, ?, ?)
    `);
function addMessage(author, text) {
    messagePreparation.run(author, text, new Date().toISOString());
}
//# sourceMappingURL=databaseHandler.js.map