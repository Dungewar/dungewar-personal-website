import WebSocket from 'ws';
import {appendDataFile, readDataFile} from "../helpers/fileHandler";

export const webSocketHandler = (socket: WebSocket) => {


    console.log(`Websocket connection started`);

    socket.send(JSON.stringify({
        "message": `Websocket connection started, fick you`
    }));
    socket.on('message', (message) => {
        console.log(`Client says ${message}`);
        const parsedMessage = JSON.parse(message.toString());

        if (parsedMessage.message)
            appendDataFile("chatroom_messages.txt", parsedMessage.message);

        const messages = readDataFile("chatroom_messages.txt");

        socket.send(JSON.stringify({
            "message": messages
        }));
    })
    socket.on('error', (err) => {
        console.error(`Web socket error: ${err}`);
    })
    socket.on('close', () => {
        console.log('Client disconnected');

    })
};