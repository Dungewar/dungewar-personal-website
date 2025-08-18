"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookHandler = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const LOG_FILE = '/srv/dungewar-personal-website-data/logs/pull-webhook.log';
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true }); // ensure dir exists
const webhookHandler = (req, res) => {
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
        (0, child_process_1.exec)('/srv/dungewar-personal-website/update-project-entry.sh', (err, stdout, stderr) => {
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
exports.webhookHandler = webhookHandler;
//# sourceMappingURL=pullWebhook.js.map