import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  clearCompletedTodos,
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  restoreTodos,
  updateTodo,
} from "@/api";
import type { UpdateTodoInput } from "@/interfaces";

const todosQueryKey = ["todos"] as const;

// DEMO ONLY: both queries set `retry: false`, since retrying can't fix bad localStorage data and only
// delays the error (mutations never retry by default). Remove both when switching to a real API.
export const useTodos = () =>
  useQuery({ queryKey: todosQueryKey, queryFn: getTodos, retry: false });

export const useTodo = (id: string) =>
  useQuery({ queryKey: [...todosQueryKey, id], queryFn: () => getTodo(id), retry: false });

// Each mutation invalidates the Todo list once it succeeds, so it refetches.
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) => updateTodo(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });
};

export const useClearCompletedTodos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCompletedTodos,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });
};

// DEMO ONLY: delete with restoreTodos when switching to a real API.
export const useRestoreTodos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreTodos,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });
};
