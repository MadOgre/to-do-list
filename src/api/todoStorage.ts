import type { Todo } from "@/interfaces";

// DEMO ONLY: everything the Todo API Functions need to keep the list in localStorage.
// Delete this file when switching to a real API (see the comment at the top of todos.ts).

const TODOS_STORAGE_KEY = "todos";

const demoTodos: Todo[] = [
  { id: "demo-1", title: "Complete online JavaScript course", completed: true },
  { id: "demo-2", title: "Jog around the park 3x", completed: false },
  { id: "demo-3", title: "10 minutes meditation", completed: false },
  { id: "demo-4", title: "Read for 1 hour", completed: false },
  { id: "demo-5", title: "Pick up groceries", completed: false },
  { id: "demo-6", title: "Complete Todo App on Frontend Mentor", completed: false },
];

// The Demo Todos until a list is stored, then the stored list, even an empty one.
// Throws if the stored data isn't valid JSON.
export const readTodos = () => {
  const stored = localStorage.getItem(TODOS_STORAGE_KEY);
  return stored === null ? demoTodos : JSON.parse(stored) as Todo[];
};

export const writeTodos = (todos: Todo[]) => {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
};

// Removes the stored list, so the next read falls back to the Demo Todos.
export const removeTodos = () => {
  localStorage.removeItem(TODOS_STORAGE_KEY);
};
