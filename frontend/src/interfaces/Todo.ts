import type { CreateTodoBody, SetTodoCompletedBody } from "@to-do-list/common";

// One Todo, as the API sends it. common/ holds its schema, which the API checks its requests with.
export type { Todo } from "@to-do-list/common";

// The body of POST /api/todos: a new Todo is always Active, and the API makes its todo_id.
export type CreateTodoInput = CreateTodoBody;

// The body of PATCH /api/todos/{todo_id}: the new value, and the version that the page last showed.
export type UpdateTodoInput = SetTodoCompletedBody;
