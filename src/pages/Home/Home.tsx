import { Alert, Card, Container, Loader, Stack, Text, Title } from "@mantine/core";
import type { FC } from "react";
import { useItems } from "@/apiHooks";
import styles from "./Home.module.scss";

export const Home: FC = () => {
  const { data: items, isPending, isError } = useItems();

  return (
    <Container component="main" py="xl">
      <Title>to-do-list</Title>
      <Text className={styles.intro} mb="md">Edit this Page to start building your app.</Text>
      {isPending && <Loader />}
      {isError && (
        <Alert color="red" title="Error">
          Could not load Items.
        </Alert>
      )}
      {items && (
        <Stack>
          {items.map(({ id, name, description }) => (
            <Card key={id} withBorder>
              <Text fw={500}>{name}</Text>
              <Text c="dimmed" size="sm">{description}</Text>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};
