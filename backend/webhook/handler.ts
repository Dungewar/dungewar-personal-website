import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

const LOG_FILE = path.join(__dirname, '../../../dungewar-personal-website-data/logs/webhook.log');

export const webhookHandler = (req: Request, res: Response) => {
    const ref = req.body?.ref;

    if (ref === "refs/heads/website") {
        const timestamp = new Date().toISOString();
        const logPrefix = `[${timestamp}] `;

        exec('/srv/dungewar-personal-website/update-project.sh', (err, stdout, stderr) => {
            const fullOutput = logPrefix + (err ? stderr : stdout);

            try {
                fs.appendFileSync(LOG_FILE, fullOutput + '\n');
            } catch (writeErr) {
                console.error(`${logPrefix} Failed to write to log file:\n`, writeErr);
            }

            if (err) {
                console.error(`${logPrefix} Webhook failed:\n`, stderr);
                return res.status(500).send('Webhook failed:\n' + stderr);
            }

            console.log(`${logPrefix} Webhook succeeded:\n`, stdout);
            return res.status(200).send('Webhook succeeded:\n' + stdout);
        });
    } else {
        const warnMsg = `[${new Date().toISOString()}] Ignored push to ${ref}`;
        console.warn(warnMsg);
        res.status(200).send("Ignored: not website branch.");
    }
};
