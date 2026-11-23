// Every handler the router can call, by the name routes.json gives it, and the file it lives in.
// Each resource gets a folder in src/, and its handlers are exported here, one line each.
export { clearCompletedTodos } from "./todos/clear-completed-todos.ts";
export { createTodo } from "./todos/create-todo.ts";
export { deleteTodo } from "./todos/delete-todo.ts";
export { listTodos } from "./todos/list-todos.ts";
export { restoreDemoTodos } from "./todos/restore-demo-todos.ts";
export { setTodoCompleted } from "./todos/set-todo-completed.ts";
