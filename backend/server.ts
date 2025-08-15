import express from 'express';
import { webhookHandler } from './routes/pullWebhook';
import {miscLogger} from "./routes/miscLogger";

const app = express();
const PORT = 4000;

app.use(express.json());
app.post('/api/webhook', webhookHandler);
app.post('/api/log', miscLogger);
app.get('/health', (_req, res) => res.send('ok'));


app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});
