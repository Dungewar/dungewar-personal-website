"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buzzerRinger = void 0;
const fileHandler_1 = require("../helpers/fileHandler");
const numberManipulation_1 = require("../helpers/numberManipulation");
const child_process_1 = require("child_process");
const LOG_FILE = "buzzer-rings.log";
const buzzerRinger = (req, res) => {
    (0, fileHandler_1.logMessageFile)(LOG_FILE, "Received request to ring buzzer");
    let duration = 25;
    if (!req || !req.body || !req.body.duration) {
        (0, fileHandler_1.logMessageFile)(LOG_FILE, "Request does not specify duration, using 25ms");
    }
    else {
        const hopefullyNumber = parseInt(req.body.duration);
        if (!isNaN(hopefullyNumber)) {
            duration = (0, numberManipulation_1.clamp)(hopefullyNumber, 1, 1000);
        }
    }
    (0, child_process_1.exec)(`/srv/iocommands/buzzer.py ${duration}`, (err, stdout, stderr) => {
        if (!err) {
            (0, fileHandler_1.logMessageFile)(LOG_FILE, "Buzzer executed without error");
        }
        else {
            (0, fileHandler_1.logErrorFile)(LOG_FILE, "Buzzer failed to execute: " + err);
        }
    });
    res.status(200).send('Logged!');
};
exports.buzzerRinger = buzzerRinger;
//# sourceMappingURL=ringBuzzer.js.map