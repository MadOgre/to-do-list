# todo-list-mvp: Round 2 questions

Settled in round 1:

- Drag and drop and its hint text are out for now. Drag and drop is planned for later, so nothing should get in its way.
- The list starts with the six todos from the design. Nothing is saved, so every reload starts over.
- **Todo** replaces **Item** (now in `CONTEXT.md`, with **Active** and **Completed**). The placeholder Item layers are renamed to Todo, and the mock routes and logic stay in place for a future API.
- The light/dark switch follows the OS setting at first. Mantine remembers the user's choice in `localStorage`, as it does by default.
- Enter adds the trimmed text to the **top** of the list as an Active Todo and clears the input. Empty input adds nothing. The circle in the input is decorative.
- Only the check and the area around it complete a Todo, not the text. Deleting asks for confirmation. No editing.
- With a mouse the ✕ shows on hover and focus; on touch it always shows.
- "1 item left" in the singular. Clear Completed always visible. A basic empty-state message.
- Josefin Sans comes from a Google Fonts `<link>`. The favicon becomes `favicon-32x32.png` and the title "Todo app". The screenshots move to `docs/planning/todo-list-mvp/design/`.

---

❓ **Q1** - **The Todo's fields**: Item has `id`, `name` and `description`. A Todo needs an id, its text and whether it is Completed. I'd use:

```ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

The mock data becomes the six todos from the design. Is `title` the name for the text (rather than `text` or `name`), and `completed` for the flag?

➡️ Yes: `id`, `title`, `completed`.

**Answer:**
as recommended

---

❓ **Q2** - **Whether the page uses the Todo API layers now**: The mock answers every request with fixed data. So if adding, completing and deleting went through the mutations, the list would refetch the fixed six todos and every change would vanish. Making the mock remember changes would be new custom logic. Options:

- (a) The page keeps its Todos in memory, starting from its own copy of the six design todos. The renamed Todo API layers stay unused until a real API arrives. The six todos then appear twice: in the mock data and in the page's starting list.
- (b) The page loads the six todos once through the Todo API Hook (showing a short loading state from the mock's 500 ms delay), copies them into memory, and makes every change in memory only. No duplicate list, but the page mixes loaded data and in-memory state, and gains a loading and an error state the design doesn't show.
- (c) Every change goes through the API, with the mock made to remember changes (new custom logic).

➡️ (a). It is the smallest thing that matches "no saving" and "no overengineering". The duplicated six todos are throwaway sample data on both sides.

**Answer:**
Actually, here's what I want:
- What I want is basically the answer C: I want every change to go through the API.
- I want the API to be implemented right now as local storage and the ability to save in local storage.
- I also would like the ability to restore back to the default 6 from the design.
- Look at the Figma screenshots, specifically the ones that show a hint for reorder, a drag-and-drop reorder.
- I want you to actually use that style, but instead of writing that hint, I want it to be a link that, if you click it, it'll restore the 6 original items.
- Otherwise, I want it to save, and I want items to persist using local storage, but the button should essentially restore it back to the original and clear the local storage.

---

❓ **Q3** - **The delete confirmation dialog**: Two Mantine ways to build it:

- (a) `@mantine/modals` and its `modals.openConfirmModal(…)`: one call, no open/closed state of our own. It is a new dependency (Mantine's own package, same version as `@mantine/core`), so you'd stop your `pnpm dev` while it installs.
- (b) `Modal` from `@mantine/core`, with our own state for which Todo is being deleted. No new dependency, more code.

Proposed copy: title "Delete todo?", body "“Jog around the park 3x” will be deleted.", buttons **Cancel** and a red **Delete**.

➡️ (a), with that copy.

**Answer:**
as recommended

---

❓ **Q4** - **Confirming Clear Completed**: Clear Completed can delete many Todos at once, so it is more destructive than a single ✕. Options:

- (a) It asks too, with the same dialog: "Delete completed todos?" / "3 completed todos will be deleted." When there are no Completed Todos, clicking it does nothing, with no dialog.
- (b) It deletes at once, with no confirmation.

➡️ (a).

**Answer:**
as recommended

---

❓ **Q5** - **The area that completes a Todo**: My reading of "the checkbox or the general area around it": the round check sits in a clickable area covering the row's left gutter, from the row's left edge to just before the text, for the full height of the row. The text and the rest of the row do nothing for now, which leaves them free for drag and drop later. With the keyboard, the check takes focus and Space toggles it (Mantine's default). Is that right?

➡️ Yes.

**Answer:**
yes

---

❓ **Q6** - **Empty-state messages**: Shown inside the list card, above the footer, when no Todos match:

- No Todos at all (any filter): "Nothing to do. Add a todo above."
- **Active** filter, none Active: "No active todos."
- **Completed** filter, none Completed: "No completed todos."

➡️ Those three, in the dimmed text colour.

**Answer:**
as recommended

---

❓ **Q7** - **Holding the list in memory**: `@mantine/hooks` (already installed) has `useListState`. Its handlers cover what this feature does: `prepend` to add, `filter` to delete and to Clear Completed, and `setItemProp` to toggle Completed. They also cover what drag and drop will need later (`reorder`). The alternative is plain React `useState` with our own update functions.

➡️ `useListState`. It is Mantine, it removes our own list-update code, and its `reorder` is ready for drag and drop.

**Answer:**
as recommended

---

❓ **Q8** - **How the code is split**: Options:

- (a) Everything in `src/pages/Home/Home.tsx`.
- (b) `Home` holds the list state and lays out the page. The parts each become a Shared Component in their own folder under `src/components/` with their SCSS module: the theme toggle, the new-todo input, a Todo row, and the footer with the filters. This adds the `src/components` barrel, which the code conventions call for with the first Shared Component.

➡️ (b). The Todo row is what drag and drop will wrap later, so it is worth having on its own. Each part stays small.

**Answer:**
as recommended

---

❓ **Q9** - **Matching the style guide's colours**: The current theme uses green as the primary colour with Mantine's default grays. To match the design, options:

- (a) Put the style guide into `theme.ts`: Blue 500 as the primary colour, Josefin Sans as the font, and the light and dark page and card colours through Mantine's theme (custom colours and a CSS variables resolver). The SCSS modules then use Mantine CSS variables only. Close to the design, and all colour decisions live in one file.
- (b) Use Mantine's nearest built-in colours (`blue`, `gray`, `dark`) and accept an approximate match.
- (c) Write the style guide's colours straight into the SCSS modules.

➡️ (a). The Definition Of Done is "as outlined by Figma design", and (a) gets there with Mantine's own theming instead of custom CSS.

**Answer:**
as recommended

---

❓ **Q10** - **The filters**: The design shows All / Active / Completed as plain words, with the selected one in blue. Mantine's `SegmentedControl` draws a pill behind the selection, which would need overriding with custom CSS. I'd use three Mantine `Button`s with `variant="transparent"`, coloured by whether they are selected. The selected filter is plain in-memory state: it resets to All on reload and isn't in the URL.

➡️ Yes to both.

**Answer:**
yes to both

---

❓ **Q11** - **Mobile/desktop switch point**: Below it, the mobile background images show and the filters move to their own card under the list. The theme keeps Mantine's default breakpoints, so `sm` is 48em (768px).

➡️ Mantine's `sm` (768px).

**Answer:**
as recommended
