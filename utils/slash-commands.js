import axios from "axios";
import { InteractionResponseType } from "discord-interactions";

import dalleHandler from "./openai/dalle.js";
import chatHandler from "./openai/chat.js";

const slashCommands = async (event) => {
    // Initialize variables
    console.log("event:", event);
    const { id: interactionId, token, data, member, guild, channel } = body;
    const { name, options } = data;
    const { user } = member;
    const { id: userId } = user;
    const { id: guildId } = guild;
    const { id: channelId } = channel;

    const interactionUrl = `https://discord.com/api/v10/interactions/${interactionId}/${interactionToken}/callback`;
    const patchInteractionUrl = `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${interactionToken}/messages/@original`;
    await axios.post(interactionUrl, {
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    });

    // Calling the handlers
    let content = null;
    let error = false;
    try {
        switch (name) {
            case "image":
                const promptValue = options.find(
                    (option) => option.name === "prompt"
                ).value;
                const sizeValue =
                    options.find((option) => option.name === "size")?.value ||
                    "256";

                content = await dalleHandler(promptValue, sizeValue);
                break;
            case "chat":
                const messageValue = options.find(
                    (option) => option.name === "message"
                ).value;
                content = await chatHandler(messageValue);
                break;
        }
    } catch (error) {
        content = error.message;
        error = true;
    } finally {
        await axios.patch(patchInteractionUrl, {
            content: error ? `Error: ${content}` : content,
        });
    }
};

export default slashCommands;
