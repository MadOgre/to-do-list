import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TodoFooter } from "@/components";

import { render } from "../test-utils/render";

describe("TodoFooter", () => {
  // The same test for each count: "1 item" is the one singular.
  it.each([
    { activeCount: 0, text: "0 items left" },
    { activeCount: 1, text: "1 item left" },
    { activeCount: 2, text: "2 items left" },
  ])("shows “$text” for $activeCount Active Todos", ({ activeCount, text }) => {
    render(<TodoFooter activeCount={activeCount} filter="all" onFilterChange={vi.fn()} onClearCompleted={vi.fn()} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("calls onClearCompleted when the user clicks Clear Completed", async () => {
    const user = userEvent.setup();
    const onClearCompleted = vi.fn();
    render(<TodoFooter activeCount={0} filter="all" onFilterChange={vi.fn()} onClearCompleted={onClearCompleted} />);

    await user.click(screen.getByRole("button", { name: "Clear Completed" }));

    expect(onClearCompleted).toHaveBeenCalledOnce();
  });
});
