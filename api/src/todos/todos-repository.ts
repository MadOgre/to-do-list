import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import type { Todo } from "@to-do-list/common";
import { Entity } from "dynamodb-toolbox/entity";
import { DeleteItemCommand } from "dynamodb-toolbox/entity/actions/delete";
import { PutItemCommand } from "dynamodb-toolbox/entity/actions/put";
import { $add, isConditionCheckFailed, UpdateItemCommand } from "dynamodb-toolbox/entity/actions/update";
import { boolean } from "dynamodb-toolbox/schema/boolean";
import { item } from "dynamodb-toolbox/schema/item";
import { number } from "dynamodb-toolbox/schema/number";
import { string } from "dynamodb-toolbox/schema/string";
import { Table } from "dynamodb-toolbox/table";
import { DeletePartitionCommand } from "dynamodb-toolbox/table/actions/deletePartition";
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

// What setTodoCompleted gives back: the changed Todo, or why nothing changed.
export type SetTodoCompletedResult =
  | { status: "updated"; todo: Todo }
  | { status: "not_found" }
  | { status: "version_conflict" };

// Sets completed, and adds 1 to the version, only if the stored version is the version that the client last saw.
// When the condition fails, DynamoDB sends back the stored item: no item means that no Todo has this ID.
export const setTodoCompleted = async (
  ownerId: string,
  todoId: string,
  completed: boolean,
  version: number,
): Promise<SetTodoCompletedResult> => {
  try {
    const { Attributes } = await TodoEntity.build(UpdateItemCommand)
      .item({ owner_id: ownerId, todo_id: todoId, completed, version: $add(1) })
      .options({
        condition: { attr: "version", eq: version },
        returnValues: "ALL_NEW",
        returnValuesOnConditionFalse: "ALL_OLD",
      })
      .send();

    if (Attributes === undefined) {
      throw new Error(`no attributes returned for todo ${todoId}`);
    }
    const todo: Todo = {
      todo_id: Attributes.todo_id,
      title: Attributes.title,
      completed: Attributes.completed,
      version: Attributes.version,
    };
    return { status: "updated", todo };
  } catch (error) {
    if (!isConditionCheckFailed(error)) {
      throw error;
    }
    if (error.Item === undefined) {
      return { status: "not_found" };
    }
    return { status: "version_conflict" };
  }
};

// Deleting a Todo that doesn't exist isn't an error: the result is the same, no Todo with that ID.
export const deleteTodo = async (ownerId: string, todoId: string) => {
  await TodoEntity.build(DeleteItemCommand).key({ owner_id: ownerId, todo_id: todoId }).send();
};

// Deletes every Completed Todo of one owner, and returns how many.
// DeletePartitionCommand queries the owner's Todos, then deletes them in batches of 25.
export const clearCompletedTodos = async (ownerId: string) => {
  const result = await todosTable
    .build(DeletePartitionCommand)
    .entities(TodoEntity)
    .query({ partition: ownerId })
    .options({ filters: { Todo: { attr: "completed", eq: true } } })
    .send();

  return result.Count ?? 0;
};

// Deletes every Todo of one owner, then writes the given Todos.
export const replaceTodos = async (ownerId: string, todos: Todo[]) => {
  await todosTable.build(DeletePartitionCommand).entities(TodoEntity).query({ partition: ownerId }).send();

  const puts = todos.map((todo) => TodoEntity.build(PutItemCommand).item({ owner_id: ownerId, ...todo }).send());
  await Promise.all(puts);
};
