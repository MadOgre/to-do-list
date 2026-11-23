import { errorResult, noContent } from "../../../route-handler-tools/responses.ts";
import type { RouteHandler } from "../../../route-handler-tools/route-handler.ts";
import { isValidTodoId } from "../todo-id.ts";
import * as todosRepository from "../todos-repository.ts";

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
