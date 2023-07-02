import client from "./dynamoDBClient.js";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const docClient = DynamoDBDocumentClient.from(client);

export default docClient;
