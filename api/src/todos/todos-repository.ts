import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import type { Todo } from "@to-do-list/common";
import { Entity } from "dynamodb-toolbox/entity";
import { DeleteItemCommand } from "dynamodb-toolbox/entity/actions/delete";
import { PutItemCommand } from "dynamodb-toolbox/entity/actions/put";
import { UpdateItemCommand } from "dynamodb-toolbox/entity/actions/update";
import { boolean } from "dynamodb-toolbox/schema/boolean";
import { item } from "dynamodb-toolbox/schema/item";
import { number } from "dynamodb-toolbox/schema/number";
import { string } from "dynamodb-toolbox/schema/string";
import { Table } from "dynamodb-toolbox/table";
import { QueryCommand } from "dynamodb-toolbox/table/actions/query";

const { TODOS_TABLE } = process.env;
if (!TODOS_TABLE) {
  throw new Error("TODOS_TABLE environment variable must be set");
}

// The one owner of every Todo until the app has logins. Then each request brings its own owner.
export const DEMO_OWNER_ID = "demo-owner";

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const todosTable = new Table({
  name: TODOS_TABLE,
  partitionKey: { name: "owner_id", type: "string" },
  sortKey: { name: "todo_id", type: "string" },
  documentClient,
});

// The table holds only Todos, so Toolbox's _et attribute adds nothing.
// Without _et, _ct and _md, items that the CLI writes read the same as items that this code writes.
const TodoEntity = new Entity({
  name: "Todo",
  table: todosTable,
  entityAttribute: false,
  timestamps: false,
  schema: item({
    owner_id: string().key(),
    todo_id: string().key(),
    title: string(),
    completed: boolean(),
    version: number(),
  }),
});

// Writes a new Todo: Active, at version 1. The condition stops a write over an existing Todo with the same ID.
export const createTodo = async (ownerId: string, todoId: string, title: string): Promise<Todo> => {
  const todo: Todo = { todo_id: todoId, title, completed: false, version: 1 };
  await TodoEntity.build(PutItemCommand)
    .item({ owner_id: ownerId, ...todo })
    .options({ condition: { attr: "todo_id", exists: false } })
    .send();

  return todo;
};

// Every Todo of one owner, newest first: a version 7 UUID starts with its creation time.
export const listTodos = async (ownerId: string): Promise<Todo[]> => {
  const result = await todosTable
    .build(QueryCommand)
    .entities(TodoEntity)
    .query({ partition: ownerId })
    // attributes: read every attribute except owner_id, so each item has exactly a Todo's keys.
    .options({ reverse: true, attributes: ["todo_id", "title", "completed", "version"], maxPages: Infinity })
    .send();

  return result.Items ?? [];
};

export const setCompleted = async (ownerId: string, todoId: string, completed: boolean) => {
  await TodoEntity.build(UpdateItemCommand)
    .item({ owner_id: ownerId, todo_id: todoId, completed })
    .options({ condition: { attr: "todo_id", exists: true } })
    .send();
};

export const deleteTodo = async (ownerId: string, todoId: string) => {
  await TodoEntity.build(DeleteItemCommand).key({ owner_id: ownerId, todo_id: todoId }).send();
};
