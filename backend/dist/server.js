"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pullWebhook_1 = require("./routes/pullWebhook");
const miscLogger_1 = require("./routes/miscLogger");
const emailListSubscribe_1 = require("./routes/emailListSubscribe");
const cors_1 = __importDefault(require("cors"));
const ringBuzzer_1 = require("./routes/ringBuzzer");
const fileHandler_1 = require("./helpers/fileHandler");
const ws_1 = __importDefault(require("ws"));
const app = (0, express_1.default)();
const PORT = 4000;
const webSocket = new ws_1.default('ws://localhost:8080');
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post('/api/webhook', pullWebhook_1.webhookHandler);
app.post('/api/log', miscLogger_1.miscLogger);
app.post('/api/email-list-subscribe', emailListSubscribe_1.emailListSubscribe);
app.post("/api/ring-buzzer", ringBuzzer_1.buzzerRinger);
app.get('/api/health', (_req, res) => {
    console.log("Health check ok");
    res.send('ok');
});
app.listen(PORT, () => {
    (0, fileHandler_1.logMessage)(`Backend listening on http://localhost:${PORT}`);
});
webSocket.addEventListener('open', () => {
    console.log("WebSocket is connected");
    webSocket.send('Hello, server');
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
//# sourceMappingURL=server.js.map