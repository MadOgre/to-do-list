import { describe, expect, it, vi } from "vitest";

import { deleteTodo } from "../../../../src/resources/todos/route-handlers/delete-todo.ts";
import * as todosRepository from "../../../../src/resources/todos/todos-repository.ts";
import { makeEvent } from "../../../fixtures/events.ts";

vi.mock("../../../../src/resources/todos/todos-repository.ts", () => ({
  DEMO_OWNER_ID: "demo-owner",
  deleteTodo: vi.fn(),
}));

const ROUTE_KEY = "DELETE /api/todos/{todo_id}";

describe("deleteTodo", () => {
  it("deletes the Todo and answers 204 with no body", async () => {
    const result = await deleteTodo(makeEvent({ routeKey: ROUTE_KEY, pathParameters: { todo_id: "test-id" } }));

    expect(todosRepository.deleteTodo).toHaveBeenCalledWith("demo-owner", "test-id");
    expect(result.outcome).toBe("deleted");
    expect(result.response.statusCode).toBe(204);
    expect(result.response.body).toBeUndefined();
  });

  it("answers 400 invalid_id for an ID with other characters, and deletes nothing", async () => {
    const result = await deleteTodo(makeEvent({ routeKey: ROUTE_KEY, pathParameters: { todo_id: "not an id!" } }));

    expect(result.outcome).toBe("invalid_id");
    expect(result.response.statusCode).toBe(400);
    expect(todosRepository.deleteTodo).not.toHaveBeenCalled();
  });
});
