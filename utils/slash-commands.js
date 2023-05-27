import axios from "axios";

import { InteractionResponseType } from "discord-interactions";

const slashCommands = async (name, interactionId, interactionToken) => {
    const interaction_url = `https://discord.com/api/v10/interactions/${interactionId}/${interactionToken}/callback`;

    if (name === "foo") {
        await axios.post(interaction_url, {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "Hello, World",
            },
        });
    }

    await axios.post(interaction_url, {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: "Hello, World 2",
        },
    });
};

export default slashCommands;
