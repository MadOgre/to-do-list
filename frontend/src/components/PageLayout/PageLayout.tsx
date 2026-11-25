import { Container, Group, Title } from "@mantine/core";
import type { FC, ReactNode } from "react";

// From its own file, not the `@/components` barrel, which re-exports this file too.
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

import classes from "./PageLayout.module.scss";

export interface PageLayoutProps {
  children: ReactNode;
}

// What every Page shares: the light or dark background image, the "TODO" header with the theme toggle, and the
// design's column width. The Page's own content goes below the header.
export const PageLayout: FC<PageLayoutProps> = ({ children }) => (
  <div className={classes.page}>
    <div className={classes.background} />
    <Container component="main" className={classes.main}>
      <Group component="header" justify="space-between" wrap="nowrap" className={classes.header}>
        <Title order={1} className={classes.title}>TODO</Title>
        <ThemeToggle />
      </Group>
      {children}
    </Container>
  </div>
);
