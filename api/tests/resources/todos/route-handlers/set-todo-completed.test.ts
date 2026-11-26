import { describe, expect, it, vi } from "vitest";

import { setTodoCompleted } from "../../../../src/resources/todos/route-handlers/set-todo-completed.ts";
import * as todosRepository from "../../../../src/resources/todos/todos-repository.ts";
import { makeEvent } from "../../../fixtures/events.ts";

vi.mock("../../../../src/resources/todos/todos-repository.ts", () => ({
  DEMO_OWNER_ID: "demo-owner",
  setTodoCompleted: vi.fn(),
}));

const ROUTE_KEY = "PATCH /api/todos/{todo_id}";

// A PATCH for the Todo "test-id" that sets it completed, from version 1, unless a test gives other parts.
const makePatchEvent = (todoId = "test-id", body = '{"completed":true,"version":1}') =>
  makeEvent({ routeKey: ROUTE_KEY, pathParameters: { todo_id: todoId }, body });

describe("setTodoCompleted", () => {
  it("answers 200 with the changed Todo", async () => {
    const todo = { todo_id: "test-id", title: "Buy milk", completed: true, version: 2 };
    vi.mocked(todosRepository.setTodoCompleted).mockResolvedValue({ status: "updated", todo });

    const result = await setTodoCompleted(makePatchEvent());

    expect(todosRepository.setTodoCompleted).toHaveBeenCalledWith("demo-owner", "test-id", true, 1);
    expect(result.outcome).toBe("updated");
    expect(result.response.statusCode).toBe(200);
    expect(JSON.parse(result.response.body ?? "")).toEqual(todo);
  });

  it("answers 404 not_found when no Todo has the ID", async () => {
    vi.mocked(todosRepository.setTodoCompleted).mockResolvedValue({ status: "not_found" });

    const result = await setTodoCompleted(makePatchEvent());

    expect(result.outcome).toBe("not_found");
    expect(result.response.statusCode).toBe(404);
  });

  it("answers 409 version_conflict when the Todo changed after the client's version", async () => {
    vi.mocked(todosRepository.setTodoCompleted).mockResolvedValue({ status: "version_conflict" });

    const result = await setTodoCompleted(makePatchEvent());

    expect(result.outcome).toBe("version_conflict");
    expect(result.response.statusCode).toBe(409);
  });

  it("answers 400 invalid_id for an ID with other characters, and changes nothing", async () => {
    const result = await setTodoCompleted(makePatchEvent("not an id!"));

    expect(result.outcome).toBe("invalid_id");
    expect(result.response.statusCode).toBe(400);
    expect(todosRepository.setTodoCompleted).not.toHaveBeenCalled();
  });

  it("answers 400 invalid_body for a body without the version, and changes nothing", async () => {
    const result = await setTodoCompleted(makePatchEvent("test-id", '{"completed":true}'));

    expect(result.outcome).toBe("invalid_body");
    expect(result.response.statusCode).toBe(400);
    expect(todosRepository.setTodoCompleted).not.toHaveBeenCalled();
  });
});
