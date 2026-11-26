import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NewTodoInput } from "@/components";

import { render } from "../test-utils/render";

describe("NewTodoInput", () => {
  it("creates the trimmed title on Enter, then clears the input", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<NewTodoInput onCreate={onCreate} />);
    const input = screen.getByRole("textbox", { name: "Create a new todo" });

    await user.type(input, "  Buy milk  {Enter}");

    expect(onCreate).toHaveBeenCalledWith("Buy milk");
    expect(input).toHaveValue("");
  });

  it("keeps the text when the create fails, so the user can try again", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockRejectedValue(new Error("network error"));
    render(<NewTodoInput onCreate={onCreate} />);
    const input = screen.getByRole("textbox", { name: "Create a new todo" });

    await user.type(input, "Buy milk{Enter}");

    expect(onCreate).toHaveBeenCalledOnce();
    expect(input).toHaveValue("Buy milk");
  });

  it("creates nothing on Enter when the input has only spaces", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<NewTodoInput onCreate={onCreate} />);

    await user.type(screen.getByRole("textbox", { name: "Create a new todo" }), "   {Enter}");

    expect(onCreate).not.toHaveBeenCalled();
  });
});
