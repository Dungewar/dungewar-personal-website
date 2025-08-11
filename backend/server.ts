import express from 'express';
import { webhookHandler } from './webhook/handler';
import {miscLogger} from "./logger/miscLogger";

const app = express();
const PORT = 4000;

app.use(express.json());
app.post('/webhook', webhookHandler);
app.post('/log', miscLogger);

app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});
