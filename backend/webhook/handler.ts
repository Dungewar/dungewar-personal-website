import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

const LOG_FILE = path.join(__dirname, '../../logs/webhook.log');

export const webhookHandler = (req: Request, res: Response) => {
    const ref = req.body.ref;

    if (ref === "refs/heads/website") {
        const timestamp = new Date().toISOString();
        const logPrefix = `[${timestamp}] `;

        exec('/srv/dungewar-personal-website/update-project.sh', (err, stdout, stderr) => {
            const fullOutput = logPrefix + (err ? stderr : stdout);

            fs.appendFileSync(LOG_FILE, fullOutput + '\n');

            if (err) {
                console.error(fullOutput);
                return res.status(500).send('Webhook failed:\n' + stderr);
            }

            console.log(fullOutput);
            res.send('Webhook succeeded:\n' + stdout);
        });
    } else {
        console.warn(`[${new Date().toISOString()}] Ignored push to ${ref}`);
        res.status(200).send("Ignored: not website branch.");
    }
};
