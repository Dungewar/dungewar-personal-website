import {Request, Response} from "express";
import {logErrorFile, logMessageFile} from "../helpers/fileHandler";
import {clamp} from "../helpers/numberManipulation";
import {exec} from "child_process";

const LOG_FILE = "buzzer-rings.log";

export const buzzerRinger = (req: Request, res: Response): void => {
    logMessageFile(LOG_FILE, "Received request to ring buzzer")

    let duration: number = 25;
    if(!req || !req.body || !req.body.duration) {
        logMessageFile(LOG_FILE, "Request does not specify duration, using 25ms");
    } else {
        const hopefullyNumber = parseInt(req.body.duration);

        if (!isNaN(hopefullyNumber)) {
            duration = clamp(hopefullyNumber, 1, 1000);
        }
    }

    exec(`/srv/iocommands/buzzer.py ${duration}`, (err, stdout, stderr) => {
        if(!err) {
            logMessageFile(LOG_FILE, "Buzzer executed without error");
        } else {
            logErrorFile(LOG_FILE, "Buzzer failed to execute: " + err)
        }
    });

    res.status(200).send('Logged!');
}
