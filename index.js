import nacl from "tweetnacl";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const handler = async (event) => {
    // Checking signature (requirement 1.)
    // Your public key can be found on your application in the Developer Portal
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    console.log(PUBLIC_KEY);
    const signature = event.headers["x-signature-ed25519"];
    const timestamp = event.headers["x-signature-timestamp"];
    const strBody = event.body; // should be string, for successful sign

    const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + strBody),
        Buffer.from(signature, "hex"),
        Buffer.from(PUBLIC_KEY, "hex")
    );

    if (!isVerified) {
        return {
            statusCode: 401,
            body: JSON.stringify("invalid request signature"),
        };
    }

    // Replying to ping (requirement 2.)
    const body = JSON.parse(strBody);
    if (body.type == 1) {
        return {
            statusCode: 200,
            body: JSON.stringify({ type: 1 }),
        };
    }

    const interactions_url = `https://discord.com/api/v10/interactions/${body.id}/${body.token}/callback`;
    await axios.post(interactions_url, {
        type: 4,
        data: {
            content: "Hello, World.",
        },
    });
};

export { handler };
