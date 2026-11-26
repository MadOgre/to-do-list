import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TodoRow } from "@/components";

import { render } from "../test-utils/render";

const activeTodo = { todo_id: "test-id", title: "Buy milk", completed: false, version: 1 };

describe("TodoRow", () => {
  it("shows the title, with the check off for an Active Todo", () => {
    render(<TodoRow todo={activeTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Buy milk" })).not.toBeChecked();
  });

  it("calls onToggle(true) when the user checks an Active Todo", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<TodoRow todo={activeTodo} onToggle={onToggle} onDelete={vi.fn()} />);

    await user.click(screen.getByRole("checkbox", { name: "Buy milk" }));

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("calls onDelete when the user clicks the delete button", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<TodoRow todo={activeTodo} onToggle={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Delete “Buy milk”" }));

    expect(onDelete).toHaveBeenCalledOnce();
  });
});
