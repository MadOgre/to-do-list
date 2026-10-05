import { Alert, Card, Container, Group, Text, Title } from "@mantine/core";
import type { FC } from "react";
import { useTodos } from "@/apiHooks";
import { ThemeToggle } from "@/components";
import styles from "./Home.module.scss";

export const Home: FC = () => {
  const { data: todos, isError } = useTodos();

  return (
    <div className={styles.page}>
      <div className={styles.background} />
      <Container component="main" className={styles.main}>
        <Group component="header" justify="space-between" wrap="nowrap" className={styles.header}>
          <Title order={1} className={styles.title}>TODO</Title>
          <ThemeToggle />
        </Group>
        {isError && <Alert color="red">Could not load your todos.</Alert>}
        {todos && (
          <Card shadow="xl" padding={0}>
            {todos.map(({ id, title, completed }) => (
              <Card.Section key={id} withBorder className={styles.row}>
                <Text fz="inherit" td={completed ? "line-through" : undefined} className={completed ? styles.completed : undefined}>
                  {title}
                </Text>
              </Card.Section>
            ))}
          </Card>
        )}
      </Container>
    </div>
  );
};
