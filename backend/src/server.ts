import express from 'express';
import {webhookHandler} from './routes/pullWebhook';
import {miscLogger} from "./routes/miscLogger";
import {emailListSubscribe} from "./routes/emailListSubscribe";
import cors from "cors";
import {buzzerRinger} from "./routes/ringBuzzer";
import {logMessage} from "./helpers/fileHandler";
import WebSocket, {WebSocketServer} from 'ws';

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

app.listen(BACKEND_PORT, () => {
    logMessage(`Backend listening on http://localhost:${BACKEND_PORT}`);
});


const webSocketServer = new WebSocketServer({port: WEBSOCKET_PORT});

const webSocketHandler = (socket: WebSocket) => {
    console.log(`Websocket connection started`);

    socket.send(JSON.stringify({
        "message": `Websocket connection started, fick you`
    }));
    socket.on('message', (message) => {
        console.log(`Client says ${message}`);
        socket.send(JSON.stringify({
            "messages": `I like cheese`
        }));
    })
    socket.on('error', (err) => {
        console.error(`Web socket error: ${err}`);
    })
    socket.on('close', () => {
        console.log('Client disconnected');
    })
};

webSocketServer.on('connection', webSocketHandler);