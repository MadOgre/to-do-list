// Reset Local Database: deletes the local todos table, creates it again, and writes the Seed.
// If DynamoDB Local isn't running, the reset starts it first and stops it at the end.
// Usage, in api/: pnpm db:reset
import { CreateTableCommand, DeleteTableCommand, DynamoDBClient, ResourceNotFoundException } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { type ChildProcess, spawn } from "node:child_process";
import { once } from "node:events";
import { connect } from "node:net";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { dynamoDbClientConfig } from "../src/database/dynamodb-client-config.ts";
import { TODOS_SEED } from "./seeds/todos.ts";

const DYNAMODB_LOCAL_PORT = 8000;
const START_TIMEOUT_MS = 10_000;
const POLL_INTERVAL_MS = 250;

const { TODOS_TABLE } = process.env;
if (!TODOS_TABLE) {
  throw new Error("TODOS_TABLE environment variable must be set");
}

// True when a program accepts connections on DynamoDB Local's port. The reset doesn't check
// that the program is DynamoDB Local: a foreign program makes the reset fail later.
const isPortAnswering = async () => {
  const socket = connect(DYNAMODB_LOCAL_PORT, "localhost");
  try {
    await once(socket, "connect");
    return true;
  } catch {
    return false;
  } finally {
    socket.destroy();
  }
};

// Starts DynamoDB Local with the same values as dev:db in api/package.json, from api/, so that
// DynamoDB Local writes dynamodb-local-metadata.json where git ignores it.
const startDynamoDbLocal = () => {
  const apiFolder = fileURLToPath(new URL("..", import.meta.url));
  const dynamoDbLocal = spawn(
    "java",
    [
      "-Djava.library.path=.dynamodb-local/DynamoDBLocal_lib",
      "-jar",
      ".dynamodb-local/DynamoDBLocal.jar",
      "-sharedDb",
      "-dbPath",
      ".dynamodb-local/data",
      "-port",
      String(DYNAMODB_LOCAL_PORT),
      "-disableTelemetry",
    ],
    { cwd: apiFolder, stdio: "ignore" },
  );
  // Without a listener, a missing java command would crash the reset. The wait below then
  // reports that DynamoDB Local didn't answer, as for a missing DynamoDB Local.
  dynamoDbLocal.on("error", () => {});
  return dynamoDbLocal;
};

const waitUntilAnswering = async () => {
  const deadline = Date.now() + START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await isPortAnswering()) {
      return true;
    }
    await sleep(POLL_INTERVAL_MS);
  }
  return false;
};

// Stops the DynamoDB Local that the reset started, and waits until its process has exited,
// so that port 8000 is free for the next pnpm dev.
const stopDynamoDbLocal = async (dynamoDbLocal: ChildProcess) => {
  const hasExited = dynamoDbLocal.exitCode !== null || dynamoDbLocal.signalCode !== null;
  if (!hasExited) {
    const exited = once(dynamoDbLocal, "exit");
    dynamoDbLocal.kill();
    await exited;
  }
};

const resetTodosTable = async (tableName: string) => {
  // Always DynamoDB Local, with fake credentials, whatever DATABASE says: the reset never reaches AWS.
  const client = new DynamoDBClient(dynamoDbClientConfig("local"));
  const documentClient = DynamoDBDocumentClient.from(client);

  // Deleting a table that doesn't exist yet, before the first reset, isn't an error.
  try {
    await client.send(new DeleteTableCommand({ TableName: tableName }));
  } catch (error) {
    if (!(error instanceof ResourceNotFoundException)) {
      throw error;
    }
  }

  // The same keys as the real table in infra/modules/app/dynamodb.tf.
  await client.send(
    new CreateTableCommand({
      TableName: tableName,
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
      await documentClient.send(new PutCommand({ TableName: tableName, Item: { owner_id: ownerId, ...todo } }));
      todosWritten += 1;
    }
  }

  console.log(`Reset ${tableName}: ${todosWritten} Todos written.`);
};

// A DynamoDB Local that runs already, as under pnpm dev, is used and left running.
if (await isPortAnswering()) {
  await resetTodosTable(TODOS_TABLE);
} else {
  console.log("DynamoDB Local isn't running. Starting it…");
  const dynamoDbLocal = startDynamoDbLocal();
  const answered = await waitUntilAnswering();
  // The try/finally stops the DynamoDB Local that the reset started, also after a failure:
  // a left-over java process would hold port 8000 and break the next pnpm dev.
  try {
    if (answered) {
      await resetTodosTable(TODOS_TABLE);
    }
  } finally {
    await stopDynamoDbLocal(dynamoDbLocal);
  }
  if (answered) {
    console.log("Stopped DynamoDB Local.");
  } else {
    console.error(
      "DynamoDB Local didn't answer within 10 seconds. Did you run bin/setup-local-db.sh? See docs/local-development.md.",
    );
    process.exitCode = 1;
  }
}
