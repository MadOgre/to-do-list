import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  clearCompletedTodos,
  createTodo,
  deleteTodo,
  getTodos,
  restoreTodos,
  updateTodo,
} from "@/api";
import type { UpdateTodoInput } from "@/interfaces";

const todosQueryKey = ["todos"] as const;

export const useTodos = () => useQuery({ queryKey: todosQueryKey, queryFn: getTodos });

// Each mutation invalidates the Todo list once it ends, whether it worked or failed, so the list refetches.
// After a 409 or a 404, the refetch shows the Todos as the API stores them.
// queryClient.ts shows the error of a failed mutation.
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTodo,
    onSettled: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ todoId, input }: { todoId: string; input: UpdateTodoInput }) => updateTodo(todoId, input),
    onSettled: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTodo,
    onSettled: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });
};

export const useClearCompletedTodos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCompletedTodos,
    onSettled: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });
};

// Temporary: delete it together with restoreTodos and the Restore Demo Todos link.
export const useRestoreTodos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreTodos,
    onSettled: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });
};
