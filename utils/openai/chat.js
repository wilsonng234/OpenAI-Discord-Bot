import { Configuration, OpenAIApi } from "openai";

async function chatHandler(message) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });

        return response.data.choices[0].message.content;
    } catch (err) {
        console.log("chatgpt error", err);
        return err.message;
    }
}

export default chatHandler;
