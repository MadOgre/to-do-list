// Reset Local Database: deletes the local todos table, creates it again, and writes the Seed.
// Usage, in api/, while pnpm dev runs DynamoDB Local: pnpm db:reset
import { CreateTableCommand, DeleteTableCommand, DynamoDBClient, ResourceNotFoundException } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { dynamoDbClientConfig } from "../src/database/dynamodb-client-config.ts";
import { TODOS_SEED } from "./seeds/todos.ts";

const { TODOS_TABLE } = process.env;
if (!TODOS_TABLE) {
  throw new Error("TODOS_TABLE environment variable must be set");
}

// Always DynamoDB Local, with fake credentials, whatever DATABASE says: the reset never reaches AWS.
const client = new DynamoDBClient(dynamoDbClientConfig("local"));
const documentClient = DynamoDBDocumentClient.from(client);

// Deleting a table that doesn't exist yet, before the first reset, isn't an error.
try {
  await client.send(new DeleteTableCommand({ TableName: TODOS_TABLE }));
} catch (error) {
  if (!(error instanceof ResourceNotFoundException)) {
    throw error;
  }
}

// The same keys as the real table in infra/modules/app/dynamodb.tf.
await client.send(
  new CreateTableCommand({
    TableName: TODOS_TABLE,
    AttributeDefinitions: [
      { AttributeName: "owner_id", AttributeType: "S" },
      { AttributeName: "todo_id", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "owner_id", KeyType: "HASH" },
      { AttributeName: "todo_id", KeyType: "RANGE" },
    ],
    BillingMode: "PAY_PER_REQUEST",
  }),
);

let todosWritten = 0;
for (const [ownerId, todos] of Object.entries(TODOS_SEED)) {
  for (const todo of todos) {
    await documentClient.send(new PutCommand({ TableName: TODOS_TABLE, Item: { owner_id: ownerId, ...todo } }));
    todosWritten += 1;
  }
}

console.log(`Reset ${TODOS_TABLE}: ${todosWritten} Todos written.`);
