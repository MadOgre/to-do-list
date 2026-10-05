# 06: Restore Demo Todos link

**Status:** ready-for-agent

**Blocked by:** 04

**Spec:** `docs/planning/todo-list-mvp/spec.md`

**What to build:** Where the design shows "Drag and drop to reorder list", the page shows a "Restore demo todos" link in the same small, dimmed, centred style. It asks "Restore demo todos?" first. Confirming replaces the user's list with the six Demo Todos and clears the stored list. The link always shows, including when the list fails to load, so it also recovers from bad stored data. It is demo-only and gets deleted when a real API arrives.

- [ ] A Mantine `Anchor` rendered as a button, "Restore demo todos", sits centred under the list card (and under the mobile filter card when that exists), in the design's hint style with a hover state
- [ ] It is always visible, including while the "Could not load your todos." alert shows
- [ ] It opens `modals.openConfirmModal`: title "Restore demo todos?", body "Your current todos will be replaced by the six demo todos.", **Cancel** and a red **Restore**
- [ ] Confirming calls `useRestoreTodos`, which removes the stored key, so the list refetches and shows the Demo Todos. A failure shows the "Could not save your change." alert
- [ ] A short comment marks the link as demo-only, matching step 3 of the switch comment in the Todo API module
- [ ] Mantine's colour scheme choice is untouched by Restore
- [ ] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [ ] Manual check on `/`:
  - After some changes, Restore's dialog shows. Confirming brings back the six Demo Todos and removes the storage key in devtools.
  - With invalid JSON under the key, Restore recovers the list.
  - The theme choice is unchanged.
