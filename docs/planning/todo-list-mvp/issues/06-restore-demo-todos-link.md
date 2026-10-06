# 06: Restore Demo Todos link

**Status:** ready-for-agent

**Blocked by:** 04

**Spec:** `docs/planning/todo-list-mvp/spec.md`

**What to build:** Where the design shows "Drag and drop to reorder list", the page shows a "Restore demo todos" link in the same small, dimmed, centered style. It asks "Restore demo todos?" first. Confirming replaces the user's list with the six Demo Todos and clears the stored list. The link always shows, including when the list fails to load, so it also recovers from bad stored data. It is demo-only and gets deleted when a real API arrives.

- [x] A Mantine `Anchor` rendered as a button, "Restore demo todos", sits centered under the list card (and under the mobile filter card when that exists), in the design's hint style with a hover state
- [x] It is always visible, including while the "Could not load your todos." alert shows
- [x] It opens `modals.openConfirmModal`: title "Restore demo todos?", body "Your current todos will be replaced by the six demo todos.", **Cancel** and a red **Restore**
- [x] Confirming calls `useRestoreTodos`, which removes the stored key, so the list refetches and shows the Demo Todos. A failure shows the "Could not save your change." alert
- [x] A short comment marks the link as demo-only, matching step 3 of the switch comment in the Todo API module
- [x] Mantine's color scheme choice is untouched by Restore
- [x] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [x] Manual check on `/`:
  - After some changes, Restore's dialog shows. Confirming brings back the six Demo Todos and removes the storage key in devtools.
  - With invalid JSON under the key, Restore recovers the list.
  - The theme choice is unchanged.

## Comments

- 2026-10-05: Implemented. `restoreTodos` and `useRestoreTodos` already existed, so the change is the link in Home and its styles. `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start pass with pnpm 10.34.5 and Node 22.23.3.
  - The link sits in Home's Stack after the cards, outside the `todos &&` block, so it also shows when the list fails to load. It is dimmed, with Anchor's own underline on hover.
  - It is 14px at every width: 24px below the list card from `sm` up, and 40px below the filter card on mobile, where the Stack's 16px gap gets a 24px margin added to it.
  - `restoreTodos` joins the changes that drive the "Could not save your change." alert.
  - The Figma MCP was at its call limit, so the hint's mobile size was read from `2.png` and recorded in `design/FIGMA.md`.
  - The developer did the manual check on `/` and reports that all of it passes.
