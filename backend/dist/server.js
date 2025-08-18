"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pullWebhook_1 = require("./routes/pullWebhook");
const miscLogger_1 = require("./routes/miscLogger");
const emailListSubscribe_1 = require("./routes/emailListSubscribe");
const app = (0, express_1.default)();
const PORT = 4000;
app.use(express_1.default.json());
app.post('/api/webhook', pullWebhook_1.webhookHandler);
app.post('/api/log', miscLogger_1.miscLogger);
app.post('/api/email-list-subscribe', emailListSubscribe_1.emailListSubscribe);
app.get('/health', (_req, res) => res.send('ok'));
app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map