import express from 'express';
import {webhookHandler} from './routes/pullWebhook';
import {miscLogger} from "./routes/miscLogger";
import {emailListSubscribe} from "./routes/emailListSubscribe";
import cors from "cors";
import {buzzerRinger} from "./routes/ringBuzzer";
import {logMessage, logMessageFile} from "./helpers/fileHandler";
import WebSocket from 'ws';

const app = express();
const PORT = 4000;
const webSocket = new WebSocket('ws://localhost:8080');

app.use(express.json());
app.use(cors());
app.post('/api/webhook', webhookHandler);
app.post('/api/log', miscLogger);
app.post('/api/email-list-subscribe', emailListSubscribe);
app.post("/api/ring-buzzer", buzzerRinger);
app.get('/api/health', (_req, res) => {
    console.log("Health check ok");
    res.send('ok');
});

app.listen(PORT, () => {
    logMessage(`Backend listening on http://localhost:${PORT}`);
});

webSocket.addEventListener('open', () => {
    console.log("WebSocket is connected");

    webSocket.send('Hello, server')
});

webSocket.addEventListener('message', event => {
    console.log("Received message: ", event.data);
});

// Executes when the connection is closed, providing the close code and reason.
webSocket.addEventListener('close', event => {
    console.log('WebSocket connection closed:', event.code, event.reason);
});

// Executes if an error occurs during the WebSocket communication.
webSocket.addEventListener('error', error => {
    console.error('WebSocket error:', error);
});