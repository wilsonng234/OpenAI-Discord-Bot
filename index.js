import axios from "axios";
import { verifyKey } from "discord-interactions";
import { InteractionType } from "discord-interactions";
import { InteractionResponseType } from "discord-interactions";

import slashCommands from "./handler/slash-commands.js";

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
        // Defer the reply to slash command
        const { id: interactionId, token: interactionToken } = body;
        const interactionUrl = `https://discord.com/api/v10/interactions/${interactionId}/${interactionToken}/callback`;
        await axios.post(interactionUrl, {
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        });

        // Handle the slash command
        await slashCommands(body, event.requestContext.requestTimeEpoch);
    }
};

export { handler };
