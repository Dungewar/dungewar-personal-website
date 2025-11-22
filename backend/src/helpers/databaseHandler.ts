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
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
`);

const messagePreparation = database.prepare(`
    INSERT INTO messages (author, text)
    VALUES (?, ?)
`);
const getLastMessagePrepare = database.prepare<[number], MessageRow>(`
    SELECT *
    FROM messages
    ORDER BY id DESC
    LIMIT ?;
`);
const getAllMessages = database.prepare<[], MessageRow>(`
SELECT id, author, text, created_at
    FROM messages
    ORDER BY id ASC
`);


export function addMessage(author: string, text: string): void {
    messagePreparation.run(author, text);
}

export interface MessageRow {
    id: number;
    author: string;
    text: string;
    created_at: number;
}
export function getMessage(messages: number): MessageRow[] {
    return getLastMessagePrepare.all(messages).reverse();
}

export function getAll(): MessageRow[] {
    return getAllMessages.all();
}
