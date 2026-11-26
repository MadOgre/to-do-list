import { describe, expect, it } from "vitest";

import { isValidTodoId } from "../../../src/resources/todos/todo-id.ts";

describe("isValidTodoId", () => {
  it("accepts a version 7 UUID, the IDs that createTodo makes", () => {
    expect(isValidTodoId("019a2b3c-4d5e-7f00-8a1b-2c3d4e5f6a7b")).toBe(true);
  });

  it("refuses an ID with a space", () => {
    expect(isValidTodoId("buy milk")).toBe(false);
  });

  it("refuses an ID of 65 characters", () => {
    expect(isValidTodoId("a".repeat(65))).toBe(false);
  });

  it("refuses a missing ID", () => {
    expect(isValidTodoId(undefined)).toBe(false);
  });
});
