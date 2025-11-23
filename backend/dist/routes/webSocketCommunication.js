"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketHandler = void 0;
const server_1 = require("../server");
const databaseHandler_1 = require("../helpers/databaseHandler");
const messageCount = 12;
const webSocketHandler = (socket) => {
    console.log(`Websocket connection started`);
    socket.send(JSON.stringify({
        "messages": (0, databaseHandler_1.getMessage)(messageCount)
    }));
    socket.on('message', (message) => {
        console.log(`Client says ${message.toString()}`);
        try {
            const parsedMessage = JSON.parse(message.toString());
            if (parsedMessage.message)
                (0, databaseHandler_1.addMessage)("Anonymous", parsedMessage.message);
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
//# sourceMappingURL=webSocketCommunication.js.map