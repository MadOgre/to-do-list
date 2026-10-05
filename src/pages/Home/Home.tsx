import { Alert, Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { type FC, useState } from "react";

import { useClearCompletedTodos, useCreateTodo, useDeleteTodo, useTodos, useUpdateTodo } from "@/apiHooks";
import { NewTodoInput, ThemeToggle, TodoFilters, TodoFooter, TodoRow } from "@/components";
import type { Todo, TodoFilter } from "@/interfaces";

import styles from "./Home.module.scss";

export const Home: FC = () => {
  const { data: todos, isError } = useTodos();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const clearCompletedTodos = useClearCompletedTodos();
  // Starts at All on every load: the filter isn't stored or put in the URL.
  const [filter, setFilter] = useState<TodoFilter>("all");
  // The alert follows the most recent change, so a later success clears an earlier failure. `submittedAt` is when
  // each mutation last ran (0 if never), so sorting by it, newest first, puts the most recent change first. A failed
  // change leaves the list as it was, since the list only refetches after a change succeeds.
  const changes = [createTodo, updateTodo, deleteTodo, clearCompletedTodos];
  const [lastChange] = changes.toSorted((a, b) => b.submittedAt - a.submittedAt);
  const saveFailed = lastChange.isError;

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

  const confirmDelete = ({ id, title }: Todo) =>
    modals.openConfirmModal({
      title: "Delete todo?",
      children: <Text size="sm">“{title}” will be deleted.</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteTodo.mutate(id),
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

  return (
    <div className={styles.page}>
      <div className={styles.background} />
      <Container component="main" className={styles.main}>
        <Group component="header" justify="space-between" wrap="nowrap" className={styles.header}>
          <Title order={1} className={styles.title}>TODO</Title>
          <ThemeToggle />
        </Group>
        <Stack className={styles.content}>
          <NewTodoInput onCreate={(title) => createTodo.mutateAsync({ title })} />
          {saveFailed && <Alert color="red">Could not save your change.</Alert>}
          {isError && <Alert color="red">Could not load your todos.</Alert>}
          {todos && (
            <>
              <Card shadow="card" padding={0}>
                {visibleTodos.map((todo) => (
                  <TodoRow
                    key={todo.id}
                    todo={todo}
                    onToggle={(completed) => updateTodo.mutate({ id: todo.id, input: { completed } })}
                    onDelete={() => confirmDelete(todo)}
                  />
                ))}
                {emptyMessage && (
                  <Text c="dimmed" ta="center" fz="inherit" lh="inherit" className={styles.empty}>
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
              <Card hiddenFrom="sm" shadow="card" padding={0} className={styles.filterCard}>
                <TodoFilters filter={filter} onFilterChange={setFilter} />
              </Card>
            </>
          )}
        </Stack>
      </Container>
    </div>
  );
};
