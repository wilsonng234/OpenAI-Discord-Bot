import { Configuration, OpenAIApi } from "openai";

async function dalleHandler(prompt, size) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    try {
        const response = await openai.createImage({
            prompt,
            n: 1,
            size: `${size}x${size}`,
        });

        return response.data.data[0].url;
    } catch (err) {
        console.log("dalle error", err);

        if (err.message === "Request failed with status code 429")
            return "Error: Too many requests. Please try again later.";

        return err.message;
    }
}

export default dalleHandler;
