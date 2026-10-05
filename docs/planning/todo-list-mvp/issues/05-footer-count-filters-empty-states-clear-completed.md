# 05: Footer: count, filters, empty states, Clear Completed

**Status:** ready-for-agent

**Blocked by:** 04

**Spec:** `docs/planning/todo-list-mvp/spec.md` · **ADR:** ADR-0002

**What to build:** The list card ends in a footer:
- **Count:** how many Active Todos are left ("1 item left" / "N items left"), the same whichever filter is selected.
- **Filters:** All / Active / Completed, with the selected one in blue. The filter resets to All on reload.
- **Clear Completed:** asks for confirmation, then deletes every Completed Todo in one request. It does nothing when no Todo is Completed.

When nothing matches, the card shows a dimmed message. On mobile, the filters move to their own card under the list.

- [x] A footer Shared Component, typed `FC<TodoFooterProps>` (or the matching name), shows the Active count, with "1 item left" in the singular and "N items left" otherwise
- [x] The filters are three Mantine `Button`s with `variant="transparent"`, blue (primary) when selected and dimmed otherwise
- [x] Home holds the selected filter in component state, starting at All, not stored and not in the URL. The filtered list and the count are derived from `useTodos()` data on each render, with no separate list state
- [x] From `sm` up the filters sit inline in the footer. Below `sm` they show in their own card under the list card
- [x] Empty states, in dimmed text inside the list card above the footer:
  - "Nothing to do. Add a todo above." when there are no Todos at all
  - "No active todos." when the Active filter matches nothing
  - "No completed todos." when the Completed filter matches nothing
- [x] "Clear Completed" is a transparent Mantine `Button`, always visible. When at least one Todo is Completed, it opens `modals.openConfirmModal`: title "Delete completed todos?", body "N completed todos will be deleted." (singular for one), **Cancel** and a red **Delete**. With none Completed, clicking it does nothing
- [x] Confirming calls `useClearCompletedTodos` (one request). A failure shows the "Could not save your change." alert
- [x] Styling matches the design in both themes and at both widths, using only Mantine CSS variables and `mantine` helpers
- [x] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [ ] Manual check on `/`:
  - The count is right, with "1 item left" for one, and stays the same across filters.
  - The filters work, the selected one is blue, and the filter resets to All on reload.
  - Each empty-state message appears in its case.
  - Clear Completed's dialog shows the count, and confirming deletes them. With none Completed, it does nothing.
  - Below 768px the filters have their own card.

## Comments

- 2026-10-05: Implemented. `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start pass with pnpm 10.34.5 and Node 22.23.3.
  - The footer is `TodoFooter`. The filters are a Shared Component of their own, `TodoFilters`, because they render in two places: inside the footer from `sm` up (`visibleFrom="sm"`), and in Home's own card below it (`hiddenFrom="sm"`). The filter type is `TodoFilter` in `src/interfaces/`.
  - The filters and "Clear Completed" are transparent Buttons cut down to their text (no height or padding), so the footer's padding gives the design's row height. Both include the `text-button` Sass mixin in `src/styles/_text-button.scss`. The footer aligns its texts on their baseline: the Button text is trimmed to its capitals and the count's isn't, so centering set the count about 2px high.
  - Dimmed footer text turns to the text color on hover, as in the interaction frame (`4.png`). The selected filter stays blue. Selected filters also carry `aria-pressed`.
  - Fixed along the way: Mantine's Card is `dark-6` in dark, not the card color, so the list card was gray in dark. The theme now gives every Card the card color (`--mantine-color-body`).
  - Checked in headless Chrome on the built app, in both themes at 375px and 1440px: the counts, the filters, both dialog texts (singular and plural), no dialog with none Completed, all three empty states, the filter reset on reload, and no horizontal scroll. The hover color was measured once (Navy 850 in light). Later runs of the same headless Chrome reported `(hover: none)`, which Chrome can't emulate away, so the hover is part of the manual check.
  - Figma's footer spacing and the filters' size are now in `design/FIGMA.md`.
  - The manual check on `/` is left to the developer.
