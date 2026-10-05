# todo-list-mvp: Round 3 questions

Settled in round 2:

- A Todo is `{ id, title, completed }`.
- **Every change goes through the Todo API.** For now the API stores the Todos in `localStorage`, so they persist across reloads.
- The six todos from the design can be brought back. Where the design has the "Drag and drop to reorder list" hint, the page shows a link in the same style that restores those six and clears what `localStorage` holds.
- Deleting a Todo asks via `@mantine/modals` `openConfirmModal` ("Delete todo?", Cancel / red Delete). Clear Completed asks with the same dialog, and does nothing when no Todo is Completed.
- The check sits in a clickable left gutter; the text and the rest of the row do nothing yet.
- Empty-state messages: "Nothing to do. Add a todo above." / "No active todos." / "No completed todos.", dimmed.
- Code split: `Home` plus Shared Components under `src/components/` (theme toggle, new-todo input, Todo row, footer with filters).
- The style guide goes into `theme.ts`, and the SCSS modules use Mantine CSS variables only.
- Filters are transparent Mantine `Button`s; the selected filter is in-memory and resets to All.
- Mobile/desktop switch at Mantine's `sm` (768px).

Two earlier answers are changed by "every change goes through the API":

- `INTENT.md` says "I don't want any saving functionality". Round 2 replaces that with `localStorage` persistence. I'm leaving `INTENT.md` as you wrote it and treating the rounds as the record. Edit it yourself if you want it to match.

NOTE: I have edited the INTENT file to remove that remark

- **Round 2 Q7 (`useListState`) no longer applies.** The list now comes from the Todo API Hook (React Query): each change is a mutation, and the list refetches after it. There is no separate in-memory list to hold. See Q7 below.

---

❓ **Q1** - **How the localStorage API plugs in**: Today each API Function calls `apiClient` and passes a per-request `adapter: mockAdapter(fixedData)`, marked `// MOCK`. Options for `localStorage`:

- (a) **Per-function adapter, same pattern as today.** Each API Function keeps its `apiClient` call (same URL and method a real backend would get) and passes an adapter that does that function's work against `localStorage`: read the list, add, update, delete. Hooking up a real backend later means deleting the adapter options, exactly as the current `// MOCK` comments describe. `mockAdapter` is replaced by a `localStorage` one, since nothing would use fixed data any more.
- (b) **API Functions skip axios for now** and read and write `localStorage` directly. Their names and return types match what the API Hooks need, so a real backend later means rewriting the function bodies only.
- (c) **One fake backend on `apiClient`.** A single adapter on the axios instance routes by method and URL (`GET /todos`, `POST /todos`, `PATCH /todos/:id`, …) and does the work in `localStorage`. The API Functions are written exactly as for a real backend, with no adapter options, and an env variable switches the fake on or off. It is the most code: a small router.

Since this is hard to undo once the API Hooks and components are built on it, and the choice won't be obvious to a later reader, I'd record the outcome as an ADR (`docs/adr/0003-…`).

➡️ (a). It keeps the pattern and the "delete the `// MOCK` lines" story the repo already has, with the least new code. Plus an ADR.

**Answer:**
B sounds the best to me. I want localStorage code to sit where axios calls would ordinarily sit. I also want the commented out axios call with a mock url in place. Basically I want the ability to very easily switch to real api, just but putting a url and deleting the local storage code. I also want concise but informative comment on steps needed to switch to real api

---

❓ **Q2** - **The API Functions**: Renamed from Item, plus what the page now needs:

- `getTodos`: the list, in display order.
- `getTodo(id)`: kept, as round 1 asked to keep the routes, though nothing uses it yet.
- `createTodo({ title })`: new Todos are Active and go to the top.
- `updateTodo(id, { completed })`: used to toggle Completed. It accepts `title` too, as `UpdateTodoInput` is a partial Todo.
- `deleteTodo(id)`.
- `clearCompletedTodos()`: **one** request (`DELETE /todos?completed=true`) rather than one delete per Completed Todo.
- `restoreTodos()`: one request (`POST /todos/restore`) that brings back the six original Todos. In `localStorage` it removes the stored list, so the next read falls back to the six.

Each gets a matching API Hook, and every mutation invalidates the list.

➡️ That set, with Clear Completed and Restore as one request each.

**Answer:**
as recommended

---

❓ **Q3** - **When the six original Todos show**: Proposed rule: the six show whenever nothing is stored (first visit, or after Restore). They are not written to `localStorage` until the first change. Once a list is stored, it is used as stored, **including an empty one**: deleting every Todo leaves an empty list after reload, and the six don't come back by themselves. The six are a constant in the API layer.

➡️ Yes to that rule.

**Answer:**
Yes, but keep in mind when real api is hooked up in the future this mock list and all logic associate with it will be deleted.  I want you to make that easy to do

---

❓ **Q4** - **The mock delay**: `mockAdapter` waits 500 ms so loading states show. With every toggle and delete now a round trip followed by a refetch, keeping that delay makes each click take about a second to show. Options:

- (a) No artificial delay for `localStorage`. Changes show immediately, with no optimistic-update code.
- (b) Keep the 500 ms, and add optimistic updates so clicks still feel instant (more custom logic).
- (c) Keep the 500 ms, and let changes show late.

➡️ (a).

**Answer:**
a. You can remove the artificial delay. That was only there to test the loading

---

❓ **Q5** - **The Restore link**:

- Copy: "Restore original todos", in the hint's style (small, dimmed, centred under the list card), looking and behaving like a link (Mantine `Anchor` rendered as a button), with a hover state.
- Confirmation: Restore throws away every change, so it asks with the same dialog: "Restore original todos?" / "Your current todos will be replaced by the six original ones." / Cancel / red **Restore**.
- Always visible, even when the list already is the original six.

➡️ Yes to all three.

**Answer:**
yes to all three
---

❓ **Q6** - **When the API fails**: `localStorage` can fail: storage blocked in some private modes, quota full, or stored data that no longer parses. Options:

- (a) **Load fails:** a red Mantine `Alert` in place of the list ("Could not load your todos."), with the Restore link still working, since restoring clears the bad data. **A change fails:** a red `Alert` above the list ("Could not save your change."), and the list stays as it was.
- (b) Treat stored data that doesn't parse as "nothing stored" and show the six silently. Other errors as in (a).
- (c) Don't handle errors beyond what React Query does by default.

➡️ (a). It is two small Alerts, and it never silently discards a user's list.

**Answer:**
as recommended
---

❓ **Q7** - **Replacing `useListState`**: With the list coming from the Todo API Hook, `Home` reads the Todos from `useTodos()` and calls the mutation hooks for every change. The filtered list and the "items left" count are worked out from that data on each render, not stored separately. `useListState` is dropped. Its `reorder` would only matter for drag and drop, which will need its own reorder request to the API anyway.

➡️ Yes: drop `useListState`. The list is the API Hook's data, and the filtered list and count are derived from it.

**Answer:**
as recommended

---

❓ **Q8** - **Name for the six**: The glossary needs a term for the six Todos from the design that Restore brings back. Options: **Original Todos** (your wording), **Starter Todos**, **Default Todos**. The action would be **Restore**.

➡️ **Original Todos** and **Restore**, with "default", "seed" and "sample" under _Avoid_.

**Answer:**
Demo Todos and the action is Restore Demo Todos
