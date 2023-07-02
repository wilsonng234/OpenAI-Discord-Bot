import docClient from "./dynamoDBDocumentClient.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const writeItem = async (tableName, item) => {
    const command = new PutCommand({
        TableName: tableName,
        Item: item,
    });

    return await docClient.send(command);
};

export default writeItem;
