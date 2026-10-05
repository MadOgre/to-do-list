# 03: Adding and completing Todos

**Status:** ready-for-agent

**Blocked by:** 02

**Spec:** `docs/planning/todo-list-mvp/spec.md` · **ADR:** ADR-0002

**What to build:** The user types a Todo into "Create a new todo…" and presses Enter. It appears at the top of the list as Active, and the input clears. The user completes a Todo by clicking its round check (or the gutter around it). The check fills with the design's gradient and tick, and the title is struck through and faded. Clicking the check again makes the Todo Active again. Clicking the title does nothing. Every change goes through the Todo API and survives a reload. If a change fails, "Could not save your change." shows above the list, and the list stays as it was.

- [ ] A new-todo input Shared Component, typed `FC<NewTodoInputProps>` (or the matching name):
  - A Mantine `TextInput` with placeholder "Create a new todo…" and a visually hidden label "Create a new todo".
  - Its left section is an empty, decorative circle.
- [ ] On Enter, the input trims the value and ignores it if empty. Otherwise it creates the Todo through `useCreateTodo`. It clears only once the create succeeds, and keeps the typed text on failure. Duplicate titles are allowed
- [ ] A Todo row Shared Component, typed `FC<TodoRowProps>` (or the matching name):
  - A round Mantine `Checkbox` with the style guide's gradient (`hsl(192, 100%, 67%)` → `hsl(280, 87%, 65%)`) and the design's check icon when checked.
  - The checkbox is labelled for screen readers with the Todo's title.
  - It sits in a clickable left gutter that covers the row's full height up to the text.
- [ ] The row's title text is not part of the checkbox label and doesn't toggle it. Long titles wrap
- [ ] Toggling calls `useUpdateTodo` with the new `completed`. Completed Todos show a struck-through title in the theme's Completed colour
- [ ] A failed create or update shows a red Mantine `Alert` "Could not save your change." above the list, and the list stays as it was
- [ ] Home renders the input above the list card and one Todo row per Todo, replacing ticket 01's plain rows
- [ ] Keyboard: Tab reaches the input and every check, and Space toggles a check
- [ ] Styling follows ADR-0002 (Mantine CSS variables and `mantine` helpers only), in both themes
- [ ] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [ ] Manual check on `/`:
  - Enter adds a trimmed Todo at the top and clears the input. Empty or spaces-only input adds nothing.
  - A duplicate is added, and a long title wraps.
  - The check and its gutter toggle Completed, and clicking the title does nothing.
  - Changes survive a reload.
  - The "change failed" alert is verified by reading the code.
