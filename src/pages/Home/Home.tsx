import { Alert, Card, Container, Stack, Text, Title } from "@mantine/core";
import type { FC } from "react";
import { useTodos } from "@/apiHooks";
import styles from "./Home.module.scss";

export const Home: FC = () => {
  const { data: todos, isError } = useTodos();

  return (
    <Container component="main" py="xl">
      <Title>to-do-list</Title>
      <Text className={styles.intro} mb="md">Edit this Page to start building your app.</Text>
      {isError && <Alert color="red">Could not load your todos.</Alert>}
      {todos && (
        <Stack>
          {todos.map(({ id, title, completed }) => (
            <Card key={id} withBorder>
              <Text td={completed ? "line-through" : undefined} c={completed ? "dimmed" : undefined}>
                {title}
              </Text>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};
