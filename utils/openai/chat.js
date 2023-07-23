import { writeItem } from "../dynamoDB/writeItem.js";
import { queryItem } from "../dynamoDB/queryItem.js";
import { Configuration, OpenAIApi } from "openai";

const limit = 30;

async function chatHandler(message, userId, guildId, channelId, timeEpoch) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    try {
        const botId = process.env.APP_ID;
        let userMessages = await queryItem(
            "Messages",
            "userId_guildId_channelId = :userId_guildId_channelId",
            {
                ":userId_guildId_channelId": `${userId}_${guildId}_${channelId}`,
            },
            { ScanIndexForward: false, Limit: limit, ConsistentRead: true }
        );
        let botMessages = await queryItem(
            "Messages",
            "userId_guildId_channelId = :userId_guildId_channelId",
            {
                ":userId_guildId_channelId": `${botId}_${guildId}_${channelId}`,
            },
            { ScanIndexForward: false, Limit: limit, ConsistentRead: true }
        );

        const messages = [...userMessages, ...botMessages];
        const sortedMessages = messages.sort(
            (msg1, msg2) => msg1.createTime - msg2.createTime
        );
        const chatMessages = sortedMessages.map((msg) => {
            return {
                role: msg.userId_guildId_channelId.startsWith(userId)
                    ? "user"
                    : "assistant",
                content: msg.message,
            };
        });
        chatMessages.push({
            role: "user",
            content: message,
        });

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chatMessages,
        });
        const responseMessage = response.data.choices[0].message.content;

        writeItem("Messages", {
            userId_guildId_channelId: `${userId}_${guildId}_${channelId}`,
            createTime: timeEpoch,
            message: message,
        });
        writeItem("Messages", {
            userId_guildId_channelId: `${process.env.APP_ID}_${guildId}_${channelId}`,
            createTime: Date.now(),
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
