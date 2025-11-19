import Database from 'better-sqlite3';
import path from 'path';

const databasePath = path.join('/srv/database/', 'data.db');

const database = new Database(databasePath);

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

export function addMessage(author: string, text: string) {
    messagePreparation.run(author, text, new Date().toISOString());
}