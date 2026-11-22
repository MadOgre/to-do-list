import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Entity } from "dynamodb-toolbox/entity";
import { DeleteItemCommand } from "dynamodb-toolbox/entity/actions/delete";
import { PutItemCommand } from "dynamodb-toolbox/entity/actions/put";
import { UpdateItemCommand } from "dynamodb-toolbox/entity/actions/update";
import { boolean } from "dynamodb-toolbox/schema/boolean";
import { item } from "dynamodb-toolbox/schema/item";
import { string } from "dynamodb-toolbox/schema/string";
import { Table } from "dynamodb-toolbox/table";
import { ScanCommand } from "dynamodb-toolbox/table/actions/scan";

const { TODOS_TABLE } = process.env;
if (!TODOS_TABLE) {
  throw new Error("TODOS_TABLE environment variable must be set");
}

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const todosTable = new Table({
  name: TODOS_TABLE,
  partitionKey: { name: "id", type: "string" },
  documentClient,
});

const Todo = new Entity({
  name: "Todo",
  table: todosTable,
  entityAttribute: false,
  timestamps: false,
  schema: item({
    id: string().key(),
    title: string(),
    completed: boolean(),
  }),
});

export const createTodo = async (id: string, title: string) => {
  await Todo.build(PutItemCommand)
    .item({ id, title, completed: false })
    .options({ condition: { attr: "id", exists: false } })
    .send();
};

export const setCompleted = async (id: string, completed: boolean) => {
  await Todo.build(UpdateItemCommand)
    .item({ id, completed })
    .options({ condition: { attr: "id", exists: true } })
    .send();
};

export const deleteTodo = async (id: string) => {
  await Todo.build(DeleteItemCommand).key({ id }).send();
};

export const listTodos = async () => {
  const result = await todosTable
    .build(ScanCommand)
    .entities(Todo)
    .options({ maxPages: Infinity })
    .send();

  return result.Items ?? [];
};
