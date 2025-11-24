import WebSocket from 'ws';
import { appendDataFile, readDataFile } from "../helpers/fileHandler";
import { webSocketServer } from "../server";
import { clamp } from "../helpers/numberManipulation";
import { addGeneratedUsername, addMessage, getGeneratedUsername, getMessage as getMessages, MessageRow } from '../helpers/databaseHandler';
import { IncomingMessage } from 'http';
import { askAI } from '../helpers/aiHandler';

const messageCount = 15;
const messageDelay = 1;
const charLimit = 1000;
const cooldownTimers: Map<string, number> = new Map<string, number>();

export const webSocketHandler = async (socket: WebSocket, req: IncomingMessage) => {
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
    if (!IP) {
        console.log(`IP missing for client, rejecting connection.`);
        return;
    }

    if (!cooldownTimers.has(IP))
        cooldownTimers.set(IP, 0);

    const params = new URL(req.url!, "http://localhost").searchParams;
    const token = params.get("token");

    if (!token) {
        console.log(`No token provided for IP ${IP}: probably a bot (rejecting connection).`);
        return;
    }

    console.log(`Websocket connection started for IP ${IP} with token ${token}`);

    socket.send(JSON.stringify({
        "messages": getMessages(messageCount)
    }));

    let userName: string | null = getGeneratedUsername(token);
    if (!userName) {
        userName = await generateNewName(token);
    };

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
                addMessage(userName, parsedMessage.message);

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
async function generateNewName(token: string) {
    while (true) { // Retry until unique name
        const result = await askAI("Generate an appropriate online nickname that has at least 15 characters, and includes the name of an interesting cheese, an adjective, and some other unique word");
        const coolName = result.response.text();

        try {
            addGeneratedUsername(token, coolName);
            return coolName;
        } catch (err) {
            // If the cheese name already exists → try again
            if (String(err).includes("UNIQUE constraint failed")) {
                continue; // next loop
            }
            throw err; // any other error = real problem
        }
    }
}