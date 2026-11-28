import { describe, expect, it } from "vitest";

import { routes } from "../../src/router/routes.ts";

describe("routes", () => {
  it("has no route for POST /api/demo-todos/restore, so that request gets the Not Found answer", () => {
    const restoreRoute = routes.find((route) => route.method === "POST" && route.path === "/api/demo-todos/restore");

    expect(restoreRoute).toBeUndefined();
  });
});
