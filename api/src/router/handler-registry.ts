// Every route handler the router can call, by the name routes.json gives it, and the file it lives in.
// Each resource gets a folder in src/resources/, with its route handlers in route-handlers/. Each one is exported here, one line each.
export { clearCompletedTodos } from "../resources/todos/route-handlers/clear-completed-todos.ts";
export { createTodo } from "../resources/todos/route-handlers/create-todo.ts";
export { deleteTodo } from "../resources/todos/route-handlers/delete-todo.ts";
export { listTodos } from "../resources/todos/route-handlers/list-todos.ts";
export { restoreDemoTodos } from "../resources/todos/route-handlers/restore-demo-todos.ts";
export { setTodoCompleted } from "../resources/todos/route-handlers/set-todo-completed.ts";
