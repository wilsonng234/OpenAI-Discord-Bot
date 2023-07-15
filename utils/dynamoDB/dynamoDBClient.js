import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
    region: process.env.awsRegion ? process.env.awsRegion : "us-east-1",
});

export default client;
