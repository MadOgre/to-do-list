import { Anchor, Card, Text, Title } from "@mantine/core";
import type { FC } from "react";
import { Link } from "react-router";

import { PageLayout } from "@/components";

import classes from "./NotFound.module.scss";

// Shown for any unknown URL, in the same layout as Home: one card, with a link back to the list.
export const NotFound: FC = () => (
  <PageLayout>
    <Card shadow="card" className={classes.card}>
      <Title order={2} className={classes.title}>Page not found</Title>
      <Text c="dimmed" fz="inherit" lh="inherit">There is no page at this address.</Text>
      <Anchor component={Link} to="/" fz="inherit" lh="inherit" className={classes.link}>Back to your todos</Anchor>
    </Card>
  </PageLayout>
);
