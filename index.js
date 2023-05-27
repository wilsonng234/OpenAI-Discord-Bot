import dotenv from "dotenv";
import { verifyKey } from "discord-interactions";
import { InteractionType } from "discord-interactions";
dotenv.config();

import slashCommands from "./utils/slash-commands.js";

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
    } else {
        await slashCommands(body.data.name, body.id, body.token);
    }
};

export { handler };
