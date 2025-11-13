"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.miscLogger = void 0;
const fileHandler_1 = require("../helpers/fileHandler");
const miscLogger = (req, res) => {
    const message = JSON.stringify({
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
        body: req.body,
    });
    (0, fileHandler_1.logMessageFile)('logs-route.log', message);
    res.status(200).send('Logged!');
};
exports.miscLogger = miscLogger;
//# sourceMappingURL=miscLogger.js.map