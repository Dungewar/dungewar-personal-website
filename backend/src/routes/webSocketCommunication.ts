import WebSocket from 'ws';
import {appendDataFile, readDataFile} from "../helpers/fileHandler";
import {webSocketServer} from "../server";

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
                appendDataFile("chatroom_messages.txt", `[${new Date().toISOString()}] ${parsedMessage.message}`);

            // send updates to all the sockets
            const messages = readDataFile("chatroom_messages.txt", 10);

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