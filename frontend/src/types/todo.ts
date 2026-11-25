// One Todo, as the API sends it, and the bodies of POST /api/todos and PATCH /api/todos/{todo_id}.
// common/ holds their schemas, which the API checks its requests with.
export type { CreateTodoBody, SetTodoCompletedBody, Todo } from "@to-do-list/common";
