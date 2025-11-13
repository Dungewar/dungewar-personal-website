import WebSocket from 'ws';
import {appendDataFile, readDataFile} from "../helpers/fileHandler";
import {webSocketServer} from "../server";
import {clamp} from "../helpers/numberManipulation";

// let listenerList: WebSocket[] = [];

export const webSocketHandler = (socket: WebSocket) => {
    console.log(`Websocket connection started`);
    // listenerList.push(socket);

    {
        const messages = readDataFile("chatroom_messages.txt", 10);
        socket.send(JSON.stringify({
            "message": messages
        }));
    }

    socket.on('message', (message) => {
        console.log(`Client says ${message.toString()}`);
        try {
            const parsedMessage = JSON.parse(message.toString());

            if (parsedMessage.message)
                appendDataFile("chatroom_messages.txt", `[${new Date().toLocaleTimeString()}] ${parsedMessage.message}`);

            let lines = 15;
            if (parsedMessage.lines)
                lines = clamp(lines, 1, 30);

            // send updates to all the sockets
            const messages = readDataFile("chatroom_messages.txt", lines);

            webSocketServer.clients.forEach((client) => {
                client.send(JSON.stringify({
                    "message": messages
                }));
            });
        } catch (error) {
            console.error(error);
        }
    })
    socket.on('error', (err) => {
        console.error(`Web socket error: ${err}`);
        // listenerList.;
    })
    socket.on('close', () => {
        console.log('Client disconnected');
    })
};