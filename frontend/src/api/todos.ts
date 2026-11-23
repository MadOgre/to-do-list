import type { CreateTodoInput, Todo, UpdateTodoInput } from "@/interfaces";

import { apiClient } from "./apiClient";

// Each API Function sends one request to the todos API. apiClient adds the /api prefix.

export const getTodos = async () => {
  const { data } = await apiClient.get<Todo[]>("/todos");
  return data;
};

export const createTodo = async (input: CreateTodoInput) => {
  const { data } = await apiClient.post<Todo>("/todos", input);
  return data;
};

export const updateTodo = async (id: string, input: UpdateTodoInput) => {
  const { data } = await apiClient.patch<Todo>(`/todos/${id}`, input);
  return data;
};

export const deleteTodo = async (id: string) => {
  await apiClient.delete(`/todos/${id}`);
};

export const clearCompletedTodos = async () => {
  await apiClient.delete("/todos", { params: { completed: true } });
};

// Temporary: replaces every Todo with the six Demo Todos. Delete it together with POST /api/demo-todos/restore.
export const restoreTodos = async () => {
  await apiClient.post("/demo-todos/restore");
};
