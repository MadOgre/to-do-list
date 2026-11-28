import type { Todo } from "@to-do-list/common";

// The Seed of the local todos table: each Owner's ID, and that Owner's Todos.
// The Demo Owner's ID is DEMO_OWNER_ID in src/resources/todos/todos-repository.ts.
// The IDs are fixed, in the version 7 UUID form, so each reset puts the same IDs back.
// The list shows the largest ID first, so the IDs grow smaller down this list.
export const TODOS_SEED: Record<string, Todo[]> = {
  "demo-owner": [
    { todo_id: "019ac000-0006-7000-8000-000000000000", title: "Complete online JavaScript course", completed: true, version: 1 },
    { todo_id: "019ac000-0005-7000-8000-000000000000", title: "Jog around the park 3x", completed: false, version: 1 },
    { todo_id: "019ac000-0004-7000-8000-000000000000", title: "10 minutes meditation", completed: false, version: 1 },
    { todo_id: "019ac000-0003-7000-8000-000000000000", title: "Read for 1 hour", completed: false, version: 1 },
    { todo_id: "019ac000-0002-7000-8000-000000000000", title: "Pick up groceries", completed: false, version: 1 },
    { todo_id: "019ac000-0001-7000-8000-000000000000", title: "Complete Todo App on Frontend Mentor", completed: false, version: 1 },
  ],
};
