import docClient from "./dynamoDBDocumentClient.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const writeItem = async (tableName, item, rest) => {
    const command = new PutCommand({
        TableName: tableName,
        Item: item,
        ...rest,
    });

    return await docClient.send(command);
};

export { writeItem };
