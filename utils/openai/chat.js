import { writeItem } from "../dynamoDB/writeItem.js";
import { Configuration, OpenAIApi } from "openai";

async function chatHandler(message, userId, guildId, channelId) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    writeItem("Messages", {
        userId_guildId_channelId: `${userId}_${guildId}_${channelId}`,
        createTime: new Date().toISOString(),
        message: message,
    });

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });
        const responseMessage = response.data.choices[0].message.content;
        writeItem("Messages", {
            userId_guildId_channelId: `${process.env.APP_ID}_${guildId}_${channelId}`,
            createTime: new Date().toISOString(),
            message: responseMessage,
        });

        return responseMessage;
    } catch (err) {
        console.log("chatgpt error", err);

        if (err.message === "Request failed with status code 429")
            return "Error: Too many requests. Please try again later.";

        return err.message;
    }
}

export default chatHandler;
