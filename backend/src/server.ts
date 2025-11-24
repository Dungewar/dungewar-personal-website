import express from 'express';
import { webhookHandler } from './routes/pullWebhook';
import { miscLogger } from "./routes/miscLogger";
import { emailListSubscribe } from "./routes/emailListSubscribe";
import cors from "cors";
import { buzzerRinger } from "./routes/ringBuzzer";
import { logMessage } from "./helpers/fileHandler";
import { WebSocketServer } from 'ws';
import { webSocketHandler } from "./routes/webSocketCommunication";
import './helpers/databaseHandler';
import { config } from "dotenv";

config({ path: '../env' });

const app = express();
const BACKEND_PORT = 4000;
const WEBSOCKET_PORT = 8080;

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
app.get("/api/name", (_req, res) => {
    res.send('Olgierd Matusiewicz the Cheese God');
});

app.listen(BACKEND_PORT, () => {
    logMessage(`Backend listening on http://localhost:${BACKEND_PORT}`);
});


export const webSocketServer = new WebSocketServer({ port: WEBSOCKET_PORT });

// webSocketServer.clients
webSocketServer.on('connection', webSocketHandler);

