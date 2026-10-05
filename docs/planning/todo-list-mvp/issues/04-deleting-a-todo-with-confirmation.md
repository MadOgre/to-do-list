# 04: Deleting a Todo, with confirmation

**Status:** ready-for-agent

**Blocked by:** 03

**Spec:** `docs/planning/todo-list-mvp/spec.md`

**What to build:** Each Todo row has a ✕. With a mouse it shows on the hovered or focused row; on touch screens it is always visible. Clicking it opens a dialog, "Delete todo?", that names the Todo. Cancel keeps the Todo, and the red Delete removes it through the Todo API. The deletion survives a reload.

- [x] Ask the developer to stop their `pnpm dev` before installing dependencies
- [x] `@mantine/modals` is a runtime dependency at the same range as `@mantine/core` (`^9.6.3`). No other new dependencies
- [x] `ModalsProvider` is added at the app root inside `MantineProvider`
- [x] The Todo row has a Mantine `ActionIcon` with the design's cross icon, labeled "Delete “<title>”". On devices with hover it shows on row hover and focus-within (`@include mantine.hover` or equivalent); on touch devices it is always visible
- [x] The ✕ opens `modals.openConfirmModal`: title "Delete todo?", body "“<title>” will be deleted.", **Cancel** and a red **Delete**
- [x] Confirming calls `useDeleteTodo`. A failure shows the "Could not save your change." alert from ticket 03
- [x] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [ ] Manual check on `/`:
  - The ✕ shows on hover with a mouse, and always in a touch-emulated view.
  - The dialog names the Todo. Cancel keeps it, Delete removes it, and the deletion survives a reload.
  - Deleting every Todo and reloading leaves the list empty, with no Demo Todos.

## Comments

- 2026-10-05: Implemented. `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start pass with pnpm 10.34.5 and Node 22.23.3. Code review (Standards + Spec) is clean after round 2.
  - `@mantine/modals` keeps the `^9.6.3` range, but the lockfile resolves 9.6.3. The newest match, 9.7.0, requires `@mantine/core` and `@mantine/hooks` at exactly 9.7.0, and both are on 9.6.3.
  - The ✕ is hidden with a plain `@media (hover: hover)` rather than `@include mantine.hover`: on touch screens that mixin switches to `:active`, which would show the ✕ only while it's pressed. While hidden, the ✕ stays in the tab order, so focusing it shows it.
  - The modal pushed the main JS chunk to about 542 kB (about 170 kB gzipped), past Vite's 500 kB warning. At the developer's request, `build.chunkSizeWarningLimit` is 600 in `vite.config.ts`, with a comment: lazy-load Pages by route once there's a second one.
  - ADR-0002 now lists `@mantine/modals` with Mantine's packages.
  - The manual check on `/` is left to the developer.
- 2026-10-05: Two fixes at the developer's request:
  - The ✕ now sits 20px from the card's edge on mobile and 24px on desktop, as in the Figma frames (now in `design/FIGMA.md`). The margin had counted from the ActionIcon's box, which is wider than the ✕, so the gap was 8px too wide on mobile and 5px on desktop.
  - Button text now centers on its capitals. Mantine trims a Button's label to the cap height and the baseline, but the label is a flex container, where the trim doesn't apply. Josefin Sans then sat the text about 0.1em high: 1.5px at 14px, measured in headless Chrome. The theme (`src/theme.ts`, with `src/theme.module.scss`) makes every Button's label a block, so the trim applies; this also covers ticket 05's footer Buttons. Measured again in the built app, the dialog's Cancel and Delete text sits within 0.01px of center.
