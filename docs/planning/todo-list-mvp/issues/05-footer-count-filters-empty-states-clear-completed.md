# 05: Footer: count, filters, empty states, Clear Completed

**Status:** ready-for-agent

**Blocked by:** 04

**Spec:** `docs/planning/todo-list-mvp/spec.md` · **ADR:** ADR-0002

**What to build:** The list card ends in a footer:
- **Count:** how many Active Todos are left ("1 item left" / "N items left"), the same whichever filter is selected.
- **Filters:** All / Active / Completed, with the selected one in blue. The filter resets to All on reload.
- **Clear Completed:** asks for confirmation, then deletes every Completed Todo in one request. It does nothing when no Todo is Completed.

When nothing matches, the card shows a dimmed message. On mobile, the filters move to their own card under the list.

- [ ] A footer Shared Component, typed `FC<TodoFooterProps>` (or the matching name), shows the Active count, with "1 item left" in the singular and "N items left" otherwise
- [ ] The filters are three Mantine `Button`s with `variant="transparent"`, blue (primary) when selected and dimmed otherwise
- [ ] Home holds the selected filter in component state, starting at All, not stored and not in the URL. The filtered list and the count are derived from `useTodos()` data on each render, with no separate list state
- [ ] From `sm` up the filters sit inline in the footer. Below `sm` they show in their own card under the list card
- [ ] Empty states, in dimmed text inside the list card above the footer:
  - "Nothing to do. Add a todo above." when there are no Todos at all
  - "No active todos." when the Active filter matches nothing
  - "No completed todos." when the Completed filter matches nothing
- [ ] "Clear Completed" is a transparent Mantine `Button`, always visible. When at least one Todo is Completed, it opens `modals.openConfirmModal`: title "Delete completed todos?", body "N completed todos will be deleted." (singular for one), **Cancel** and a red **Delete**. With none Completed, clicking it does nothing
- [ ] Confirming calls `useClearCompletedTodos` (one request). A failure shows the "Could not save your change." alert
- [ ] Styling matches the design in both themes and at both widths, using only Mantine CSS variables and `mantine` helpers
- [ ] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [ ] Manual check on `/`:
  - The count is right, with "1 item left" for one, and stays the same across filters.
  - The filters work, the selected one is blue, and the filter resets to All on reload.
  - Each empty-state message appears in its case.
  - Clear Completed's dialog shows the count, and confirming deletes them. With none Completed, it does nothing.
  - Below 768px the filters have their own card.
