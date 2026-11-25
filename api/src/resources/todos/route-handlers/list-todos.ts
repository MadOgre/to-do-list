import { json } from "../../../route-handler-tools/responses.ts";
import type { RouteHandler } from "../../../route-handler-tools/route-handler.ts";
import * as todosRepository from "../todos-repository.ts";

export const listTodos: RouteHandler = async () => {
  const todos = await todosRepository.listTodos(todosRepository.DEMO_OWNER_ID);

  return {
    outcome: "listed",
    message: `listed ${todos.length} todos`,
    response: json(200, todos),
  };
};
