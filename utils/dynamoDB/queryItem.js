import docClient from "./dynamoDBDocumentClient.js";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const queryItem = async (
    tableName,
    keyConditionExpression,
    expressionAttributeValues,
    rest
) => {
    const command = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ConsistentRead: true,
        ...rest,
    });

    const response = await docClient.send(command);
    return response["Items"];
};

export { queryItem };
