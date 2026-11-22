import { createTodoBodySchema } from "@to-do-list/common";
import { randomUUIDv7 } from "node:crypto";

import { readJsonBody } from "../request-body.ts";
import { json } from "../response-builders.ts";
import type { RouteHandler } from "../route-handler-types.ts";
import * as todosRepository from "./todos-repository.ts";

export const createTodo: RouteHandler = async (event) => {
  const check = readJsonBody(event, createTodoBodySchema);
  if (!check.ok) {
    return check.result;
  }

  // A version 7 UUID starts with its creation time, so the newest Todo sorts last in the table.
  const todoId = randomUUIDv7();
  const todo = await todosRepository.createTodo(todosRepository.DEMO_OWNER_ID, todoId, check.body.title);

  return {
    outcome: "created",
    message: `created todo ${todoId}`,
    response: json(201, todo),
  };
};
