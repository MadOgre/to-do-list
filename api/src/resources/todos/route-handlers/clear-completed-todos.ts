import { errorResult, noContent } from "../../../route-handler-tools/responses.ts";
import type { RouteHandler } from "../../../route-handler-tools/route-handler.ts";
import * as todosRepository from "../todos-repository.ts";

export const clearCompletedTodos: RouteHandler = async (event) => {
  // Only ?completed=true clears. Without the filter, DELETE /api/todos would read as "delete every Todo".
  if (event.queryStringParameters?.completed !== "true") {
    return errorResult(400, "invalid_query", "the query must be completed=true");
  }

  const count = await todosRepository.clearCompletedTodos(todosRepository.DEMO_OWNER_ID);

  return {
    outcome: "cleared",
    message: `cleared ${count} completed todos`,
    response: noContent(),
  };
};
