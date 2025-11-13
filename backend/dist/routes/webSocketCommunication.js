"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketHandler = void 0;
const fileHandler_1 = require("../helpers/fileHandler");
const server_1 = require("../server");
const numberManipulation_1 = require("../helpers/numberManipulation");
// let listenerList: WebSocket[] = [];
const webSocketHandler = (socket) => {
    console.log(`Websocket connection started`);
    // listenerList.push(socket);
    {
        const messages = (0, fileHandler_1.readDataFile)("chatroom_messages.txt", 10);
        socket.send(JSON.stringify({
            "message": messages
        }));
    }
    socket.on('message', (message) => {
        console.log(`Client says ${message.toString()}`);
        try {
            const parsedMessage = JSON.parse(message.toString());
            if (parsedMessage.message)
                (0, fileHandler_1.appendDataFile)("chatroom_messages.txt", `[${new Date().toLocaleTimeString()}] ${parsedMessage.message}`);
            let lines = 15;
            if (parsedMessage.lines)
                lines = (0, numberManipulation_1.clamp)(lines, 1, 30);
            // send updates to all the sockets
            const messages = (0, fileHandler_1.readDataFile)("chatroom_messages.txt", lines);
            server_1.webSocketServer.clients.forEach((client) => {
                client.send(JSON.stringify({
                    "message": messages
                }));
            });
        }
        catch (error) {
            console.error(error);
        }
    });
    socket.on('error', (err) => {
        console.error(`Web socket error: ${err}`);
        // listenerList.;
    });
    socket.on('close', () => {
        console.log('Client disconnected');
    });
};
exports.webSocketHandler = webSocketHandler;
//# sourceMappingURL=webSocketCommunication.js.map