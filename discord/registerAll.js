import axios from "axios";

const globalApplicationCommandsUrl = `https://discord.com/api/v8/applications/${process.env.APP_ID}/commands`;

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bot ${process.env.BOT_TOKEN}`,
};

const names = ["image", "chat"];
const descriptions = [
    "Create an image based on input prompt",
    "Chat with the bot",
];
const options = [
    [
        {
            name: "prompt",
            description: "Prompt to generate image",
            type: 3,
            required: true,
        },
        {
            name: "size",
            description: "Size of the image",
            type: 4,
            required: false,
            choices: [
                {
                    name: "Small",
                    value: 256,
                },
                {
                    name: "Medium",
                    value: 512,
                },
                {
                    name: "Large",
                    value: 1024,
                },
            ],
        },
    ],
    [
        {
            name: "message",
            description: "Message to send to the bot",
            type: 3,
            required: true,
        },
    ],
];

const jsons = names.map((name, index) => ({
    name,
    type: 1,
    description: descriptions[index],
    options: options[index],
}));

await Promise.all(
    jsons.map(async (json) => {
        const strJson = JSON.stringify(json);
        const config = { headers };
        await axios.post(globalApplicationCommandsUrl, strJson, config);

        console.log(`Successfully registered command ${json.name}`);
    })
);

console.log("Successfully registered all global commands");
