import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  clearCompletedTodos,
  createTodo,
  deleteTodo,
  listTodos,
  setTodoCompleted,
} from "@/api";
import type { SetTodoCompletedBody } from "@/types";

const todosQueryKey = ["todos"] as const;

export const useListTodos = () => useQuery({ queryKey: todosQueryKey, queryFn: listTodos });

// Each mutation invalidates the Todo list once it ends, whether it worked or failed, so the list refetches.
// After a 409 or a 404, the refetch shows the Todos as the API stores them.
// query-client.ts shows the error of a failed mutation.
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTodo,
    onSettled: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });
};

export const useSetTodoCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ todoId, input }: { todoId: string; input: SetTodoCompletedBody }) => setTodoCompleted(todoId, input),
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
