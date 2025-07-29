import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

const LOG_FILE = path.join(__dirname, '../../logs/webhook.log');

export const webhookHandler = (req: Request, res: Response): void => {
    const event = req.body?.event;

    if (event === 'update_from_git') {
        const timestamp = new Date().toISOString();
        const logPrefix = `[${timestamp}] `;

        exec('/srv/dungewar-personal-website/update-project.sh', (err, stdout, stderr) => {
            const output = logPrefix + (err ? stderr : stdout);

            try {
                fs.appendFileSync(LOG_FILE, output + '\n');
            } catch (logErr) {
                console.error(`${logPrefix}Failed to write to log:`, logErr);
            }

            if (err) {
                console.error(output);
                res.status(500).send('Webhook failed:\n' + stderr);
            } else {
                console.log(output);
                res.send('Webhook succeeded:\n' + stdout);
            }
        });

    } else {
        res.status(400).send('Unknown request');
    }
};
