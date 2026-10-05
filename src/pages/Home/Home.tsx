import { Alert, Card, Container, Group, Stack, Title } from "@mantine/core";
import type { FC } from "react";

import { useCreateTodo, useTodos, useUpdateTodo } from "@/apiHooks";
import { NewTodoInput, ThemeToggle, TodoRow } from "@/components";

import styles from "./Home.module.scss";

export const Home: FC = () => {
  const { data: todos, isError } = useTodos();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  // The alert follows the most recent change, so a later success clears an earlier failure. `submittedAt` is when
  // each mutation last ran (0 if never). A failed change leaves the list as it was, since the list only refetches
  // after a change succeeds.
  const lastChange = createTodo.submittedAt > updateTodo.submittedAt ? createTodo : updateTodo;
  const saveFailed = lastChange.isError;

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
                />
              ))}
            </Card>
          )}
        </Stack>
      </Container>
    </div>
  );
};
