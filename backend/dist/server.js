"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketServer = void 0;
const express_1 = __importDefault(require("express"));
const pullWebhook_1 = require("./routes/pullWebhook");
const miscLogger_1 = require("./routes/miscLogger");
const emailListSubscribe_1 = require("./routes/emailListSubscribe");
const cors_1 = __importDefault(require("cors"));
const ringBuzzer_1 = require("./routes/ringBuzzer");
const fileHandler_1 = require("./helpers/fileHandler");
const ws_1 = require("ws");
const webSocketCommunication_1 = require("./routes/webSocketCommunication");
require("./helpers/databaseHandler");
require("dotenv/config");
const app = (0, express_1.default)();
const BACKEND_PORT = 4000;
const WEBSOCKET_PORT = 8080;
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
app.get("/api/name", (_req, res) => {
    res.send('Olgierd Matusiewicz the Cheese God');
});
app.listen(BACKEND_PORT, () => {
    (0, fileHandler_1.logMessage)(`Backend listening on http://localhost:${BACKEND_PORT}`);
});
exports.webSocketServer = new ws_1.WebSocketServer({ port: WEBSOCKET_PORT });
// webSocketServer.clients
exports.webSocketServer.on('connection', webSocketCommunication_1.webSocketHandler);
//# sourceMappingURL=server.js.map