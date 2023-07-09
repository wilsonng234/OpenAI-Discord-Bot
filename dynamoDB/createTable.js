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
            AttributeName: "userId_guildId_channelId",
            AttributeType: "S",
        },
        {
            AttributeName: "createTime",
            AttributeType: "N",
        },
    ],
    KeySchema: [
        {
            AttributeName: "userId_guildId_channelId",
            KeyType: "HASH",
        },
        {
            AttributeName: "createTime",
            KeyType: "RANGE",
        },
    ],
    BillingMode: "PAY_PER_REQUEST",
});

const response = await client.send(command);
console.log(response);
