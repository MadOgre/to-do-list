import { json } from "../response-builders.ts";
import type { RouteHandler } from "../route-handler-types.ts";
import * as todosRepository from "./todos-repository.ts";

export const listTodos: RouteHandler = async () => {
  const todos = await todosRepository.listTodos(todosRepository.DEMO_OWNER_ID);

  return {
    outcome: "listed",
    message: `listed ${todos.length} todos`,
    response: json(200, todos),
  };
};
