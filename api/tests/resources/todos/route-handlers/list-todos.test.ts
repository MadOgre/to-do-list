import { describe, expect, it, vi } from "vitest";

import { listTodos } from "../../../../src/resources/todos/route-handlers/list-todos.ts";
import * as todosRepository from "../../../../src/resources/todos/todos-repository.ts";
import { makeEvent } from "../../../fixtures/events.ts";

vi.mock("../../../../src/resources/todos/todos-repository.ts", () => ({
  DEMO_OWNER_ID: "demo-owner",
  listTodos: vi.fn(),
}));

describe("listTodos", () => {
  it("answers 200 with the owner's Todos, in the repository's order", async () => {
    const todos = [
      { todo_id: "second", title: "Read for 1 hour", completed: false, version: 1 },
      { todo_id: "first", title: "Buy milk", completed: true, version: 2 },
    ];
    vi.mocked(todosRepository.listTodos).mockResolvedValue(todos);

    const result = await listTodos(makeEvent({ routeKey: "GET /api/todos" }));

    expect(todosRepository.listTodos).toHaveBeenCalledWith("demo-owner");
    expect(result.outcome).toBe("listed");
    expect(result.response.statusCode).toBe(200);
    expect(JSON.parse(result.response.body ?? "")).toEqual(todos);
  });

  it("answers 200 with an empty list when the owner has no Todos", async () => {
    vi.mocked(todosRepository.listTodos).mockResolvedValue([]);

    const result = await listTodos(makeEvent({ routeKey: "GET /api/todos" }));

    expect(result.response.statusCode).toBe(200);
    expect(JSON.parse(result.response.body ?? "")).toEqual([]);
  });
});
