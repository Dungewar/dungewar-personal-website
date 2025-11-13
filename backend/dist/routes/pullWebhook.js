"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookHandler = void 0;
const child_process_1 = require("child_process");
const fileHandler_1 = require("../helpers/fileHandler");
const LOG_FILE = "pull-webhook.log";
const webhookHandler = (req, res) => {
    const ref = req.body?.ref;
    (0, fileHandler_1.logMessage)("Received unverified (for now) request to update website");
    if (ref === "refs/heads/website") {
        try {
            (0, fileHandler_1.logMessageFile)(LOG_FILE, "Received routes, running update-website.sh");
        }
        catch (writeErr) {
            (0, fileHandler_1.logErrorFile)(LOG_FILE, "Failed to write to log file:" + writeErr);
            return res.status(500).send('Webhook failed: Failed to write to log file, but update-website.sh may have still executed');
        }
        (0, child_process_1.exec)('/srv/dungewar-personal-website/update-project-entry.sh', (err, stdout, stderr) => {
            if (!err) {
                (0, fileHandler_1.logMessageFile)(LOG_FILE, "Webhook executed without error");
            }
            else {
                // logErrorFile(LOG_FILE, "Update failed:" + err);
                // We don't have time to wait for it to fully update :/
            }
        });
        return res.status(200).send('Webhook succeeded, website should update in a few minutes');
    }
    else {
        // const warnMsg = `[${new Date().toISOString()}] `;
        // console.warn(warnMsg);
        (0, fileHandler_1.logMessageFile)(LOG_FILE, `Ignored push to ${ref}`);
        // try {
        //     fs.appendFileSync(LOG_FILE, logPrefix + warnMsg);
        // } catch (writeErr) {
        //     console.error(`${logPrefix} Failed to write to log file:\n`, writeErr);
        //     return res.status(500).send('Webhook failed: Failed to write to log file, but the request would have been ignored anyway');
        // }
        res.status(200).send("Ignored: not website branch.");
    }
};
exports.webhookHandler = webhookHandler;
//# sourceMappingURL=pullWebhook.js.map