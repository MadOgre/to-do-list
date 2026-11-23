import { setTodoCompletedBodySchema } from "@to-do-list/common";

import { readJsonBody } from "../request-body.ts";
import { errorResult, json } from "../response-builders.ts";
import type { RouteHandler } from "../route-handler-types.ts";
import { isValidTodoId } from "./todo-id.ts";
import * as todosRepository from "./todos-repository.ts";

export const setTodoCompleted: RouteHandler = async (event) => {
  const todoId = event.pathParameters?.todo_id;
  if (!isValidTodoId(todoId)) {
    return errorResult(400, "invalid_id", "the ID isn't 1 to 64 letters, digits or hyphens");
  }

  const check = readJsonBody(event, setTodoCompletedBodySchema);
  if (!check.ok) {
    return check.result;
  }

  const { completed, version } = check.body;
  const result = await todosRepository.setTodoCompleted(todosRepository.DEMO_OWNER_ID, todoId, completed, version);
  if (result.status === "not_found") {
    return errorResult(404, "not_found", `no todo with ID ${todoId}`);
  }
  if (result.status === "version_conflict") {
    return errorResult(409, "version_conflict", `todo ${todoId} changed after version ${version}`);
  }

  return {
    outcome: "updated",
    message: `set todo ${todoId} to ${completed ? "completed" : "active"}, version ${result.todo.version}`,
    response: json(200, result.todo),
  };
};
