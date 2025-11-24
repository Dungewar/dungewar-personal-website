"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketHandler = void 0;
const server_1 = require("../server");
const databaseHandler_1 = require("../helpers/databaseHandler");
const aiHandler_1 = require("../helpers/aiHandler");
const messageCount = 15;
const messageDelay = 1;
const charLimit = 1000;
const cooldownTimers = new Map();
const webSocketHandler = async (socket, req) => {
    const xff = req.headers['x-forwarded-for'];
    let ip;
    if (typeof xff === 'string') {
        // header can be "client, proxy1, proxy2", so take first
        ip = xff.split(',')[0].trim();
    }
    else if (Array.isArray(xff) && xff.length > 0) {
        ip = xff[0].split(',')[0].trim();
    }
    else {
        ip = req.socket.remoteAddress ?? '';
    }
    const IP = ip;
    if (!IP) {
        console.log(`IP missing for client, rejecting connection.`);
        return;
    }
    if (!cooldownTimers.has(IP))
        cooldownTimers.set(IP, 0);
    const params = new URL(req.url, "http://localhost").searchParams;
    const token = params.get("token");
    if (!token) {
        console.log(`No token provided for IP ${IP}: probably a bot (rejecting connection).`);
        return;
    }
    console.log(`Websocket connection started for IP ${IP} with token ${token}`);
    socket.send(JSON.stringify({
        "messages": (0, databaseHandler_1.getMessage)(messageCount)
    }));
    let userName = (0, databaseHandler_1.getGeneratedUsername)(token);
    if (!userName) {
        userName = await generateNewName(token);
    }
    ;
    socket.on('message', (message) => {
        const lastSent = cooldownTimers.get(IP);
        if (lastSent === undefined) {
            console.error("For some reason IP ", IP, " has no timer");
            return;
        }
        if (Date.now() - lastSent < messageDelay * 1000)
            return; // they're spamming
        cooldownTimers.set(IP, Date.now());
        // console.log(`Client says ${message.toString()}`);
        try {
            const parsedMessage = JSON.parse(message.toString());
            // parsedMessage.message = parsedMessage.message as string;
            if (parsedMessage.message && parsedMessage.message.length < charLimit)
                (0, databaseHandler_1.addMessage)(userName, parsedMessage.message);
            // if (parsedMessage.messageCount)
            //     messageCount = clamp(messageCount, 1, 30);
            server_1.webSocketServer.clients.forEach((client) => {
                client.send(JSON.stringify({
                    "messages": (0, databaseHandler_1.getMessage)(messageCount)
                }));
            });
        }
        catch (error) {
            console.error(error);
        }
    });
    socket.on('error', (err) => {
        console.error(`Web socket error: ${err}`);
    });
    socket.on('close', () => {
        console.log('Client disconnected');
    });
};
exports.webSocketHandler = webSocketHandler;
async function generateNewName(token) {
    while (true) { // Retry until unique name
        const result = await (0, aiHandler_1.askAI)("Generate ONE appropriate online nickname that has at least 15 characters, and includes the name of an interesting cheese, an adjective, and some other unique word. You should just return the single nickname, nothing else. for instance, give CheeseLord but NO PUNCTUATIOON or bolding or capitalizing or quotation marks, just the name");
        const coolName = result.response.text();
        try {
            (0, databaseHandler_1.addGeneratedUsername)(token, coolName);
            return coolName;
        }
        catch (err) {
            // If the cheese name already exists → try again
            if (String(err).includes("UNIQUE constraint failed")) {
                continue; // next loop
            }
            throw err; // any other error = real problem
        }
    }
}
//# sourceMappingURL=webSocketCommunication.js.map