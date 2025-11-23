import WebSocket from 'ws';
import { appendDataFile, readDataFile } from "../helpers/fileHandler";
import { webSocketServer } from "../server";
import { clamp } from "../helpers/numberManipulation";
import { addMessage, getMessage as getMessages, MessageRow } from '../helpers/databaseHandler';

const messageCount = 15;
const messageDelay = 3;

export const webSocketHandler = (socket: WebSocket) => {
    console.log(`Websocket connection started`);
    let lastSent = 0;

    socket.send(JSON.stringify({
        "messages": getMessages(messageCount)
    }));

    socket.on('message', (message) => {

        if (new Date().getUTCMilliseconds() - lastSent < messageDelay * 1000)
            return; // they're spamming

        lastSent = new Date().getUTCMilliseconds();

        console.log(`Client says ${message.toString()}`);
        try {
            const parsedMessage = JSON.parse(message.toString());

            if (parsedMessage.message)
                addMessage("Anonymous", parsedMessage.message);

            // if (parsedMessage.messageCount)
            //     messageCount = clamp(messageCount, 1, 30);


            webSocketServer.clients.forEach((client) => {
                client.send(JSON.stringify({
                    "messages": getMessages(messageCount)
                }));
            });
        } catch (error) {
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