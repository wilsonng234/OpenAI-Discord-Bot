import dotenv from "dotenv";
dotenv.config();
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
    region: process.env.awsRegion ? process.env.awsRegion : "us-east-1",
});

const command = new CreateTableCommand({
    TableName: "Messages",
    AttributeDefinitions: [
        {
            AttributeName: "userId",
            AttributeType: "S",
        },
        {
            AttributeName: "channelId_messageId",
            AttributeType: "S",
        },
    ],
    KeySchema: [
        {
            AttributeName: "userId",
            KeyType: "HASH",
        },
        {
            AttributeName: "channelId_messageId",
            KeyType: "RANGE",
        },
    ],
    BillingMode: "PAY_PER_REQUEST",
});

const response = await client.send(command);
console.log(response);
