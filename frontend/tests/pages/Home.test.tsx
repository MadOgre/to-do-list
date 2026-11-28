import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Home } from "@/pages/Home/Home";

import { render } from "../test-utils/render";

// The HTTP client is the boundary: every API Function sends its request through it.
vi.mock("@/api/api-client", () => ({
  apiClient: { get: vi.fn().mockResolvedValue({ data: [] }) },
}));

describe("Home", () => {
  it("doesn't show the Restore Demo Todos link", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Home />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Restore demo todos")).not.toBeVisible();
  });
});
