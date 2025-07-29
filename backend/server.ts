import express from 'express';
import { webhookHandler } from './webhook/handler';

const app = express();
const PORT = 4000;

app.use(express.json());
app.post('/webhook', webhookHandler);

app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});
