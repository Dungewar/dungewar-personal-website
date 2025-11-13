import WebSocket from 'ws';
import {appendDataFile, readDataFile} from "../helpers/fileHandler";

export const webSocketHandler = (socket: WebSocket) => {


    console.log(`Websocket connection started`);

    socket.send(JSON.stringify({
        "message": `Websocket connection started, fick you`
    }));
    socket.on('message', (message) => {
        console.log(`Client says ${message.toString()}`);
        try {
            const parsedMessage = JSON.parse(message.toString());

            if (parsedMessage.message)
                appendDataFile("chatroom_messages.txt", new Date().toDateString() + " " + parsedMessage.message);

            const messages = readDataFile("chatroom_messages.txt", 10);

            socket.send(JSON.stringify({
                "message": messages
            }));
        } catch (error) {
            console.error(error);
        }
    })
    socket.on('error', (err) => {
        console.error(`Web socket error: ${err}`);
    })
    socket.on('close', () => {
        console.log('Client disconnected');
    })
};