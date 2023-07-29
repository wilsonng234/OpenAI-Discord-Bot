import axios from "axios";

import dalleHandler from "./openai/dalle.js";
import chatHandler from "./openai/chat.js";

const splitMessages = (message) => {
    const embedDescriptionCharacterLimit = 4096;
    let currentIndex = 0;
    let embedDescriptions = [];

    for (let i = 0; i < 10 && currentIndex < message.length; i++) {
        let endIndex = currentIndex + embedDescriptionCharacterLimit;
        embedDescriptions.push(message.slice(currentIndex, endIndex));
        currentIndex = endIndex;
    }

    return currentIndex < message.length
        ? ["The response is too long to display. Please try again."]
        : embedDescriptions;
};

const slashCommands = async (body, timeEpoch) => {
    // Initialize variables
    const { token: interactionToken, data } = body;
    const patchInteractionUrl = `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${interactionToken}/messages/@original`;
    const { name, options } = data;

    // Calling the handlers
    let userMessage = null;
    try {
        switch (name) {
            case "image":
                userMessage = options.find(
                    (option) => option.name === "prompt"
                ).value;
                const sizeValue =
                    options.find((option) => option.name === "size")?.value ||
                    "256";

                await axios.patch(patchInteractionUrl, {
                    embeds: [
                        {
                            title: `> ${userMessage}`,
                            image: {
                                url: await dalleHandler(userMessage, sizeValue),
                            },
                            color: 3447003,
                        },
                    ],
                });
                break;

            case "chat":
                userMessage = options.find(
                    (option) => option.name === "message"
                ).value;

                const { member, guild, channel } = body;

                const embeds = splitMessages(
                    await chatHandler(
                        userMessage,
                        member.user.id,
                        guild.id,
                        channel.id,
                        timeEpoch
                    )
                ).map((msg, idx) => {
                    return {
                        ...(idx === 0 && { title: `> ${userMessage}` }),
                        description: msg,
                        color: 3447003,
                    };
                });

                await axios.patch(patchInteractionUrl, {
                    embeds: embeds,
                });

                break;
        }
    } catch (error) {
        await axios.patch(patchInteractionUrl, {
            embeds: [
                {
                    title: `> ${userMessage}`,
                    description: `Error: ${error.message}`,
                    color: 3447003,
                },
            ],
        });
    }
};

export default slashCommands;
