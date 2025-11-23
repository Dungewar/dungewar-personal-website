import WebSocket from 'ws';
import { appendDataFile, readDataFile } from "../helpers/fileHandler";
import { webSocketServer } from "../server";
import { clamp } from "../helpers/numberManipulation";
import { addMessage, getMessage as getMessages, MessageRow } from '../helpers/databaseHandler';
import { IncomingMessage } from 'http';

const messageCount = 15;
const messageDelay = 1;
const charLimit = 1000;
const cooldownTimers: Map<string, number> = new Map<string, number>();

export const webSocketHandler = (socket: WebSocket, req: IncomingMessage) => {
    const xff = req.headers['x-forwarded-for'];

    let ip: string;

    if (typeof xff === 'string') {
        // header can be "client, proxy1, proxy2", so take first
        ip = xff.split(',')[0].trim();
    } else if (Array.isArray(xff) && xff.length > 0) {
        ip = xff[0].split(',')[0].trim();
    } else {
        ip = req.socket.remoteAddress ?? '';
    }

    const IP = ip;
    if (!IP) return;

    if (!cooldownTimers.has(IP))
        cooldownTimers.set(IP, 0);

    console.log(`Websocket connection started for IP `, IP);

    socket.send(JSON.stringify({
        "messages": getMessages(messageCount)
    }));

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