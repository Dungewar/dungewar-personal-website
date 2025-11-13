import express from 'express';
import {webhookHandler} from './routes/pullWebhook';
import {miscLogger} from "./routes/miscLogger";
import {emailListSubscribe} from "./routes/emailListSubscribe";
import cors from "cors";

const app = express();
const PORT = 4000;
const webSocket = new WebSocket('ws://localhost:8080');

app.use(express.json());
app.use(cors());
app.post('/api/webhook', webhookHandler);
app.post('/api/log', miscLogger);
app.post('/api/email-list-subscribe', emailListSubscribe);
app.get('/health', (_req, res) => {
    console.log("Health check ok");
    res.send('ok');
});

app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
    console.log(`Also hello, this is nothing you should worry about :)`);
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