import { describe, expect, it, vi } from "vitest";

import { clearCompletedTodos } from "../../../../src/resources/todos/route-handlers/clear-completed-todos.ts";
import * as todosRepository from "../../../../src/resources/todos/todos-repository.ts";
import { makeEvent } from "../../../fixtures/events.ts";

vi.mock("../../../../src/resources/todos/todos-repository.ts", () => ({
  DEMO_OWNER_ID: "demo-owner",
  clearCompletedTodos: vi.fn(),
}));

const ROUTE_KEY = "DELETE /api/todos";

describe("clearCompletedTodos", () => {
  it("clears the Completed Todos and answers 204 for ?completed=true", async () => {
    vi.mocked(todosRepository.clearCompletedTodos).mockResolvedValue(2);

    const result = await clearCompletedTodos(
      makeEvent({ routeKey: ROUTE_KEY, queryStringParameters: { completed: "true" } }),
    );

    expect(todosRepository.clearCompletedTodos).toHaveBeenCalledWith("demo-owner");
    expect(result.outcome).toBe("cleared");
    expect(result.message).toBe("cleared 2 completed todos");
    expect(result.response.statusCode).toBe(204);
  });

  // A table of cases: the same test runs once for each row, with the row's label in its name.
  it.each([
    { label: "no query", event: makeEvent({ routeKey: ROUTE_KEY }) },
    { label: "completed=false", event: makeEvent({ routeKey: ROUTE_KEY, queryStringParameters: { completed: "false" } }) },
  ])("answers 400 invalid_query for $label, and deletes nothing", async ({ event }) => {
    const result = await clearCompletedTodos(event);

    expect(result.outcome).toBe("invalid_query");
    expect(result.response.statusCode).toBe(400);
    expect(todosRepository.clearCompletedTodos).not.toHaveBeenCalled();
  });
});
