import type { Todo } from "@to-do-list/common";
import { randomUUIDv7 } from "node:crypto";

import { noContent } from "../../../route-handler-tools/responses.ts";
import type { RouteHandler } from "../../../route-handler-tools/route-handler.ts";
import { DEMO_TODOS } from "../demo-todos.ts";
import * as todosRepository from "../todos-repository.ts";

// Temporary: the frontend's Restore Demo Todos link calls this route. Delete the route together with the link.
export const restoreDemoTodos: RouteHandler = async () => {
  // The list shows the largest ID first. Two IDs from the same millisecond can come in any order,
  // so sort them, largest first: then the list shows DEMO_TODOS in its order.
  const todoIds = DEMO_TODOS.map(() => randomUUIDv7()).sort().reverse();

  const todos: Todo[] = DEMO_TODOS.map((demoTodo, index) => {
    const todoId = todoIds[index];
    if (todoId === undefined) {
      throw new Error("one ID is missing for the Demo Todos");
    }
    return { todo_id: todoId, ...demoTodo, version: 1 };
  });
  await todosRepository.replaceTodos(todosRepository.DEMO_OWNER_ID, todos);

  return {
    outcome: "restored",
    message: `restored ${todos.length} demo todos`,
    response: noContent(),
  };
};
