import type { CreateTodoInput, Todo, UpdateTodoInput } from "@/interfaces";
// import { apiClient } from "./apiClient";
import { readTodos, removeTodos, writeTodos } from "./todoStorage";

// The Todos live in localStorage until a real API exists. To switch:
// 1. Set VITE_API_BASE_URL in .env.local.
// 2. Uncomment the apiClient import and each function's REAL API lines, delete its LOCAL STORAGE lines,
//    and make the function async.
// 3. Delete todoStorage.ts and restoreTodos, together with useRestoreTodos and the Restore Demo Todos link in Home.

const findTodo = (todos: Todo[], id: string) => {
  const todo = todos.find((candidate) => candidate.id === id);
  if (!todo) {
    throw new Error(`Todo ${id} not found`);
  }
  return todo;
};

export const getTodos = () => {
  // REAL API:
  // const { data } = await apiClient.get<Todo[]>("/todos");
  // return data;

  // LOCAL STORAGE:
  const todos = readTodos();
  return Promise.resolve(todos);
};

export const getTodo = (id: string) => {
  // REAL API:
  // const { data } = await apiClient.get<Todo>(`/todos/${id}`);
  // return data;

  // LOCAL STORAGE:
  const todo = findTodo(readTodos(), id);
  return Promise.resolve(todo);
};

export const createTodo = (input: CreateTodoInput) => {
  // REAL API:
  // const { data } = await apiClient.post<Todo>("/todos", input);
  // return data;

  // LOCAL STORAGE:
  const todo: Todo = { id: crypto.randomUUID(), completed: false, ...input };
  writeTodos([todo, ...readTodos()]);
  return Promise.resolve(todo);
};

export const updateTodo = (id: string, input: UpdateTodoInput) => {
  // REAL API:
  // const { data } = await apiClient.patch<Todo>(`/todos/${id}`, input);
  // return data;

  // LOCAL STORAGE:
  const todos = readTodos();
  const todo = { ...findTodo(todos, id), ...input };
  writeTodos(todos.map((candidate) => (candidate.id === id ? todo : candidate)));
  return Promise.resolve(todo);
};

export const deleteTodo = (id: string) => {
  // REAL API:
  // await apiClient.delete(`/todos/${id}`);

  // LOCAL STORAGE:
  writeTodos(readTodos().filter((todo) => todo.id !== id));
  return Promise.resolve();
};

export const clearCompletedTodos = () => {
  // REAL API:
  // await apiClient.delete("/todos", { params: { completed: true } });

  // LOCAL STORAGE:
  writeTodos(readTodos().filter((todo) => !todo.completed));
  return Promise.resolve();
};

// DEMO ONLY: Restore Demo Todos.
export const restoreTodos = () => {
  removeTodos();
  return Promise.resolve();
};
