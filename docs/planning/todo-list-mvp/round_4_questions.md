# todo-list-mvp: Round 4 questions

Settled in round 3:

- **The API Functions read and write `localStorage` directly**, where the axios calls would normally sit. Each one keeps its real axios call (real URL, `apiClient`) commented out next to it. Switching to a real API means setting the URL and deleting the `localStorage` code, and a short comment says how.
- API Functions: `getTodos`, `getTodo`, `createTodo`, `updateTodo`, `deleteTodo`, `clearCompletedTodos` (one request), `restoreTodos` (one request). Each has an API Hook, and every mutation invalidates the list.
- The six from the design are now the **Demo Todos** (in `CONTEXT.md`, with **Restore Demo Todos**). They show while nothing is stored. A stored empty list stays empty. The Demo Todos and all the logic around them get deleted when a real API arrives, so that has to be easy.
- No artificial delay.
- A link restores the Demo Todos: it is always visible, styled like the design's hint, and asks for confirmation first.
- Failures show a red `Alert`: in place of the list when loading fails, above the list when a change fails.
- `useListState` is dropped. The list is the API Hook's data, and the filtered list and count are derived from it.

No ADR: round 3's choice is built so the switch is easy to undo, so it doesn't meet the "hard to reverse" bar. The switch steps live in a code comment instead.

---

❓ **Q1** - **What an API Function looks like**: Proposed layout, using `createTodo` as the example:

```ts
// src/api/todos.ts
// TO SWITCH TO A REAL API:
// 1. Set VITE_API_BASE_URL in .env.local.
// 2. Uncomment the apiClient import and each function's "REAL API" lines, and delete its "LOCAL STORAGE" lines.
// 3. Delete todoStorage.ts and restoreTodos (plus useRestoreTodos and the Restore Demo Todos link in Home).
// import { apiClient } from "./apiClient";
import { readTodos, writeTodos } from "./todoStorage";

export const createTodo = async (input: CreateTodoInput) => {
  // REAL API:
  // const { data } = await apiClient.post<Todo>("/todos", input);
  // return data;

  // LOCAL STORAGE:
  const todo: Todo = { id: crypto.randomUUID(), completed: false, ...input };
  writeTodos([todo, ...readTodos()]);
  return todo;
};
```

- Every API Function stays `async` and returns the same types as before, so the API Hooks and components don't change at the switch.
- Everything that exists only for `localStorage` goes in one file, **`src/api/todoStorage.ts`**: the storage key, the Demo Todos, and `readTodos` (which falls back to the Demo Todos when nothing is stored) and `writeTodos`. The switch deletes that file whole.
- The `apiClient` import is commented out too, because lint would otherwise fail on an unused import.
- `CreateTodoInput` becomes `{ title }` only (`Pick<Todo, "title">`): a new Todo is always Active, and the real server would set `id` and `completed` itself.

➡️ Yes to that layout and those four points.

**Answer:**
as recommended

---

❓ **Q2** - **`mockAdapter.ts`**: With no API Function passing an adapter, `src/api/mockAdapter.ts` has no users. `apiClient.ts` and `VITE_API_BASE_URL` stay, because the switch needs them.

➡️ Delete `mockAdapter.ts`. Keep `apiClient.ts` and `VITE_API_BASE_URL`.

**Answer:**
as recommended

---

❓ **Q3** - **Restore Demo Todos once a real API exists**: Your round 3 answer says the Demo Todos and their logic go away with the switch. So I'd treat Restore Demo Todos as demo-only too. `restoreTodos` has no "REAL API" lines, only `localStorage` code, and the switch deletes it with `useRestoreTodos` and the link (step 3 in the Q1 comment). The alternative is a real `POST /todos/restore` endpoint that the server would have to provide.

➡️ Demo-only: deleted at the switch.

**Answer:**
as recommended

---

❓ **Q4** - **Restore link copy**: Round 3 settled "Restore original todos". With the new term, the copy would be:

- Link: "Restore demo todos"
- Dialog: "Restore demo todos?" / "Your current todos will be replaced by the six demo todos." / Cancel / red **Restore**

➡️ That copy.

**Answer:**
as recommended

---

❓ **Q5** - **Small behaviors the design doesn't show**:

- **Accessibility:** the icon-only controls get labels for screen readers: the theme toggle says "Switch to dark theme" or "Switch to light theme", and the ✕ says "Delete “<title>”". The new-todo input gets a visually hidden label "Create a new todo". Each check is labeled with its Todo's title.
- **Long titles** wrap onto more lines, with no length limit.
- **Duplicate titles** are allowed.
- **The input clears** only once the create succeeds, so a failed create keeps what you typed.

➡️ Yes to all four.

**Answer:**
as recommended
