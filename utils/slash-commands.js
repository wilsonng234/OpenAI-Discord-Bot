import axios from "axios";

import dalleHandler from "./openai/dalle.js";
import chatHandler from "./openai/chat.js";

const slashCommands = async (body) => {
    // Initialize variables
    const { token: interactionToken, data, member, guild, channel } = body;
    const patchInteractionUrl = `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${interactionToken}/messages/@original`;
    const { name, options } = data;
    const userId = member.id;
    const guildId = guild.id;
    const channelId = channel.id;

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
                content = await chatHandler(
                    messageValue,
                    userId,
                    guildId,
                    channelId
                );
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
