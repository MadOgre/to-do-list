import { Alert, Anchor, Card, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { type FC, useState } from "react";

import {
  useClearCompletedTodos,
  useCreateTodo,
  useDeleteTodo,
  useListTodos,
  useRestoreDemoTodos,
  useSetTodoCompleted,
} from "@/api-hooks";
import { NewTodoInput, PageLayout, TodoFilters, TodoFooter, TodoRow } from "@/components";
import type { Todo, TodoFilter } from "@/types";

import classes from "./Home.module.scss";

export const Home: FC = () => {
  const { data: todos, isError } = useListTodos();
  const createTodo = useCreateTodo();
  const setTodoCompleted = useSetTodoCompleted();
  const deleteTodo = useDeleteTodo();
  const clearCompletedTodos = useClearCompletedTodos();
  const restoreDemoTodos = useRestoreDemoTodos();
  // Starts at All on every load: the filter isn't stored or put in the URL.
  const [filter, setFilter] = useState<TodoFilter>("all");

  // Derived from the query's data on each render, so there is no list state to keep in sync.
  const allTodos = todos ?? [];
  const activeTodos = allTodos.filter((todo) => !todo.completed);
  const completedTodos = allTodos.filter((todo) => todo.completed);
  const todosByFilter = { all: allTodos, active: activeTodos, completed: completedTodos };
  const visibleTodos = todosByFilter[filter];

  const getEmptyMessage = () => {
    if (allTodos.length === 0) {
      return "Nothing to do. Add a todo above.";
    }
    if (visibleTodos.length > 0) {
      return null;
    }
    return filter === "active" ? "No active todos." : "No completed todos.";
  };
  const emptyMessage = getEmptyMessage();

  const confirmDelete = ({ todo_id, title }: Todo) =>
    modals.openConfirmModal({
      title: "Delete todo?",
      children: <Text size="sm">“{title}” will be deleted.</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteTodo.mutate(todo_id),
    });

  // With no Completed Todo there is nothing to clear, so no dialog opens.
  const confirmClearCompleted = () => {
    const count = completedTodos.length;
    if (count === 0) {
      return;
    }
    modals.openConfirmModal({
      title: "Delete completed todos?",
      children: (
        <Text size="sm">
          {count === 1 ? "1 completed todo will be deleted." : `${count} completed todos will be deleted.`}
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => clearCompletedTodos.mutate(),
    });
  };

  const confirmRestore = () =>
    modals.openConfirmModal({
      title: "Restore demo todos?",
      children: <Text size="sm">Your current todos will be replaced by the six demo todos.</Text>,
      labels: { confirm: "Restore", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => restoreDemoTodos.mutate(),
    });

  return (
    <PageLayout>
      <Stack className={classes.content}>
        <NewTodoInput onCreate={(title) => createTodo.mutateAsync({ title })} />
        {isError && <Alert color="red">Could not load your todos.</Alert>}
        {todos && (
          <>
            <Card shadow="card" padding={0}>
              {visibleTodos.map((todo) => (
                <TodoRow
                  key={todo.todo_id}
                  todo={todo}
                  onToggle={(completed) => setTodoCompleted.mutate({ todoId: todo.todo_id, input: { completed, version: todo.version } })}
                  onDelete={() => confirmDelete(todo)}
                />
              ))}
              {emptyMessage && (
                <Text c="dimmed" ta="center" fz="inherit" lh="inherit" className={classes.empty}>
                  {emptyMessage}
                </Text>
              )}
              <TodoFooter
                activeCount={activeTodos.length}
                filter={filter}
                onFilterChange={setFilter}
                onClearCompleted={confirmClearCompleted}
              />
            </Card>
            {/* Below `sm` the filters leave the footer for a card of their own. */}
            <Card hiddenFrom="sm" shadow="card" padding={0} className={classes.filterCard}>
              <TodoFilters filter={filter} onFilterChange={setFilter} />
            </Card>
          </>
        )}
        {/* Temporary: calls POST /api/demo-todos/restore. Delete it together with that route, restoreDemoTodos and
            useRestoreDemoTodos. Shown even when the list fails to load. */}
        <Anchor component="button" type="button" c="dimmed" onClick={confirmRestore} className={classes.restoreLink}>
          Restore demo todos
        </Anchor>
      </Stack>
    </PageLayout>
  );
};
