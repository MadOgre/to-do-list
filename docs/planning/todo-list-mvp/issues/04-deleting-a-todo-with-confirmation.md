# 04: Deleting a Todo, with confirmation

**Status:** ready-for-agent

**Blocked by:** 03

**Spec:** `docs/planning/todo-list-mvp/spec.md`

**What to build:** Each Todo row has a ✕. With a mouse it shows on the hovered or focused row; on touch screens it is always visible. Clicking it opens a dialog, "Delete todo?", that names the Todo. Cancel keeps the Todo, and the red Delete removes it through the Todo API. The deletion survives a reload.

- [ ] Ask the developer to stop their `pnpm dev` before installing dependencies
- [ ] `@mantine/modals` is a runtime dependency at the same range as `@mantine/core` (`^9.6.3`). No other new dependencies
- [ ] `ModalsProvider` is added at the app root inside `MantineProvider`
- [ ] The Todo row has a Mantine `ActionIcon` with the design's cross icon, labelled "Delete “<title>”". On devices with hover it shows on row hover and focus-within (`@include mantine.hover` or equivalent); on touch devices it is always visible
- [ ] The ✕ opens `modals.openConfirmModal`: title "Delete todo?", body "“<title>” will be deleted.", **Cancel** and a red **Delete**
- [ ] Confirming calls `useDeleteTodo`. A failure shows the "Could not save your change." alert from ticket 03
- [ ] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [ ] Manual check on `/`:
  - The ✕ shows on hover with a mouse, and always in a touch-emulated view.
  - The dialog names the Todo. Cancel keeps it, Delete removes it, and the deletion survives a reload.
  - Deleting every Todo and reloading leaves the list empty, with no Demo Todos.
