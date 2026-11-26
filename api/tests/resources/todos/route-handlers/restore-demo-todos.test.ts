import { describe, expect, it, vi } from "vitest";

import { DEMO_TODOS } from "../../../../src/resources/todos/demo-todos.ts";
import { restoreDemoTodos } from "../../../../src/resources/todos/route-handlers/restore-demo-todos.ts";
import * as todosRepository from "../../../../src/resources/todos/todos-repository.ts";
import { makeEvent } from "../../../fixtures/events.ts";

vi.mock("../../../../src/resources/todos/todos-repository.ts", () => ({
  DEMO_OWNER_ID: "demo-owner",
  restoreDemoTodos: vi.fn(),
}));

describe("restoreDemoTodos", () => {
  it("writes the Demo Todos at version 1, with IDs that sort them in the list's order, and answers 204", async () => {
    const result = await restoreDemoTodos(makeEvent({ routeKey: "POST /api/demo-todos/restore" }));

    expect(result.outcome).toBe("restored");
    expect(result.response.statusCode).toBe(204);

    // The Todos that the route handler passed to the repository, from the mock's record of its first call.
    const [ownerId, todos] = vi.mocked(todosRepository.restoreDemoTodos).mock.calls[0] ?? [];
    expect(ownerId).toBe("demo-owner");
    expect(todos?.map(({ title, completed, version }) => ({ title, completed, version }))).toEqual(
      DEMO_TODOS.map((demoTodo) => ({ ...demoTodo, version: 1 })),
    );

    // The list shows the largest ID first, so the IDs must go from largest to smallest.
    const todoIds = todos?.map((todo) => todo.todo_id) ?? [];
    expect(todoIds).toEqual([...todoIds].sort().reverse());
  });
});
