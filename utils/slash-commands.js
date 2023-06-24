import axios from "axios";
import { InteractionResponseType } from "discord-interactions";

import dalleHandler from "./openai/dalle.js";
import chatHandler from "./openai/chat.js";

const slashCommands = async (
    name,
    options,
    interactionId,
    interactionToken
) => {
    const interactionUrl = `https://discord.com/api/v10/interactions/${interactionId}/${interactionToken}/callback`;
    const patchInteractionUrl = `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${interactionToken}/messages/@original`;
    switch (name) {
        case "image":
            await axios.post(interactionUrl, {
                type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            });

            const promptValue = options.find(
                (option) => option.name === "prompt"
            ).value;
            const sizeValue =
                options.find((option) => option.name === "size")?.value ||
                "256";

            await axios.patch(patchInteractionUrl, {
                content: await dalleHandler(promptValue, sizeValue),
            });

            break;
        case "chat":
            console.log("Entered chat");
            await axios.post(interactionUrl, {
                type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            });

            const messageValue = options.find(
                (option) => option.name === "message"
            ).value;

            await axios.patch(patchInteractionUrl, {
                content: await chatHandler(messageValue),
            });

            break;
    }
};

export default slashCommands;
