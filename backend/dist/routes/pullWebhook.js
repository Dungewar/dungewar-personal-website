import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
const LOG_FILE = '/srv/dungewar-personal-website-data/logs/pull-webhook.log';
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true }); // ensure dir exists
export const webhookHandler = (req, res) => {
    const ref = req.body?.ref;
    const timestamp = () => { return new Date().toISOString(); };
    const logPrefix = `[${timestamp}] `;
    if (ref === "refs/heads/website") {
        try {
            fs.appendFileSync(LOG_FILE, logPrefix + "Received routes, running update-website.sh\n");
        }
        catch (writeErr) {
            console.error(`${logPrefix} Failed to write to log file:\n`, writeErr);
            return res.status(500).send('Webhook failed: Failed to write to log file, but update-website.sh may have still executed');
        }
        exec('/srv/dungewar-personal-website/update-project-entry.sh', (err, stdout, stderr) => {
            if (!err) {
                fs.appendFileSync(LOG_FILE, logPrefix + "Webhook executed without error");
            }
        });
        return res.status(200).send('Webhook succeeded, website should update in a few minutes');
    }
    else {
        const warnMsg = `[${new Date().toISOString()}] Ignored push to ${ref}`;
        console.warn(warnMsg);
        try {
            fs.appendFileSync(LOG_FILE, logPrefix + warnMsg);
        }
        catch (writeErr) {
            console.error(`${logPrefix} Failed to write to log file:\n`, writeErr);
            return res.status(500).send('Webhook failed: Failed to write to log file, but the request would have been ignored anyway');
        }
        res.status(200).send("Ignored: not website branch.");
    }
};
//# sourceMappingURL=pullWebhook.js.map