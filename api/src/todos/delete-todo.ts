import { errorResult, noContent } from "../response-builders.ts";
import type { RouteHandler } from "../route-handler-types.ts";
import { isValidTodoId } from "./todo-id.ts";
import * as todosRepository from "./todos-repository.ts";

export const deleteTodo: RouteHandler = async (event) => {
  const todoId = event.pathParameters?.todo_id;
  if (!isValidTodoId(todoId)) {
    return errorResult(400, "invalid_id", "the ID isn't 1 to 64 letters, digits or hyphens");
  }

  await todosRepository.deleteTodo(todosRepository.DEMO_OWNER_ID, todoId);

  return {
    outcome: "deleted",
    message: `deleted todo ${todoId}`,
    response: noContent(),
  };
};
