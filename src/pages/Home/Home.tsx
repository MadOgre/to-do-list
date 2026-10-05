import { Alert, Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import type { FC } from "react";

import { useCreateTodo, useDeleteTodo, useTodos, useUpdateTodo } from "@/apiHooks";
import { NewTodoInput, ThemeToggle, TodoRow } from "@/components";
import type { Todo } from "@/interfaces";

import styles from "./Home.module.scss";

export const Home: FC = () => {
  const { data: todos, isError } = useTodos();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  // The alert follows the most recent change, so a later success clears an earlier failure. `submittedAt` is when
  // each mutation last ran (0 if never), so sorting by it, newest first, puts the most recent change first. A failed
  // change leaves the list as it was, since the list only refetches after a change succeeds.
  const changes = [createTodo, updateTodo, deleteTodo];
  const [lastChange] = changes.toSorted((a, b) => b.submittedAt - a.submittedAt);
  const saveFailed = lastChange.isError;

  const confirmDelete = ({ id, title }: Todo) =>
    modals.openConfirmModal({
      title: "Delete todo?",
      children: <Text size="sm">“{title}” will be deleted.</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteTodo.mutate(id),
    });

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
            <Card shadow="card" padding={0}>
              {todos.map((todo) => (
                <TodoRow
                  key={todo.id}
                  todo={todo}
                  onToggle={(completed) => updateTodo.mutate({ id: todo.id, input: { completed } })}
                  onDelete={() => confirmDelete(todo)}
                />
              ))}
            </Card>
          )}
        </Stack>
      </Container>
    </div>
  );
};
