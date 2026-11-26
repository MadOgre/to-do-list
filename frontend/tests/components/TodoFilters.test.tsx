import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TodoFilters } from "@/components";

import { render } from "../test-utils/render";

describe("TodoFilters", () => {
  it("marks only the selected filter as pressed", () => {
    render(<TodoFilters filter="active" onFilterChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Active" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Completed" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onFilterChange with the filter that the user clicks", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<TodoFilters filter="all" onFilterChange={onFilterChange} />);

    await user.click(screen.getByRole("button", { name: "Completed" }));

    expect(onFilterChange).toHaveBeenCalledWith("completed");
  });
});
