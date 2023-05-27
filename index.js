import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

import { verifyKey } from "discord-interactions";
import { InteractionType, InteractionResponseType } from "discord-interactions";

const handler = async (event) => {
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const signature = event.headers["x-signature-ed25519"];
    const timestamp = event.headers["x-signature-timestamp"];
    const strBody = event.body;

    const isValidRequest = verifyKey(strBody, signature, timestamp, PUBLIC_KEY);
    if (!isValidRequest) {
        return {
            statusCode: 401,
            body: JSON.stringify("Bad request signature"),
        };
    }

    const body = JSON.parse(strBody);
    if (body.type == InteractionType.PING) {
        return {
            statusCode: 200,
            body: JSON.stringify({ type: InteractionType.PING }),
        };
    }

    const interactions_url = `https://discord.com/api/v10/interactions/${body.id}/${body.token}/callback`;
    await axios.post(interactions_url, {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: "Hello, World",
        },
    });
};

export { handler };
