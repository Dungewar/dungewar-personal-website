import express from 'express';
import {webhookHandler} from './routes/pullWebhook';
import {miscLogger} from "./routes/miscLogger";
import {emailListSubscribe} from "./routes/emailListSubscribe";
import cors from "cors";
import {buzzerRinger} from "./routes/ringBuzzer";

const app = express();
const PORT = 4000;

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
    console.log(`Backend listening on http://localhost:${PORT}`);
    console.log(`Also hello, this is nothing you should worry about :)`);
});
