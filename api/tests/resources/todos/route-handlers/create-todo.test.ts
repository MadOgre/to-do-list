import { describe, expect, it, vi } from "vitest";

import { createTodo } from "../../../../src/resources/todos/route-handlers/create-todo.ts";
import * as todosRepository from "../../../../src/resources/todos/todos-repository.ts";
import { makeEvent } from "../../../fixtures/events.ts";

// Replaces the repository for every test in this file. The route handler gets these exports in place of the real
// ones, so no test talks to DynamoDB, and the real file's TODOS_TABLE check never runs.
vi.mock("../../../../src/resources/todos/todos-repository.ts", () => ({
  DEMO_OWNER_ID: "demo-owner",
  createTodo: vi.fn(),
}));

describe("createTodo", () => {
  it("creates the Todo and answers 201 with it", async () => {
    const todo = { todo_id: "test-id", title: "Buy milk", completed: false, version: 1 };
    vi.mocked(todosRepository.createTodo).mockResolvedValue(todo);

    const result = await createTodo(makeEvent({ routeKey: "POST /api/todos", body: '{"title":"Buy milk"}' }));

    expect(todosRepository.createTodo).toHaveBeenCalledWith("demo-owner", expect.any(String), "Buy milk");
    expect(result.outcome).toBe("created");
    expect(result.response.statusCode).toBe(201);
    expect(JSON.parse(result.response.body ?? "")).toEqual(todo);
  });

  it("answers 400 invalid_body for an empty title, and creates nothing", async () => {
    const result = await createTodo(makeEvent({ routeKey: "POST /api/todos", body: '{"title":"   "}' }));

    expect(result.outcome).toBe("invalid_body");
    expect(result.response.statusCode).toBe(400);
    expect(todosRepository.createTodo).not.toHaveBeenCalled();
  });
});
