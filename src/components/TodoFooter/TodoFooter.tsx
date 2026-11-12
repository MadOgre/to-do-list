import { Box, Button, Text } from "@mantine/core";
import type { FC } from "react";

// From its own file, not the `@/components` barrel, which re-exports this file too.
import { TodoFilters } from "@/components/TodoFilters/TodoFilters";
import type { TodoFilter } from "@/interfaces";

import styles from "./TodoFooter.module.scss";

export interface TodoFooterProps {
  activeCount: number;
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  onClearCompleted: () => void;
}

// The list card's last row. From `sm` up the filters sit in the middle; below it, Home shows them in their own card.
export const TodoFooter: FC<TodoFooterProps> = ({ activeCount, filter, onFilterChange, onClearCompleted }) => (
  <div className={styles.footer}>
    <Text c="dimmed" fz="inherit" lh="inherit">
      {activeCount === 1 ? "1 item left" : `${activeCount} items left`}
    </Text>
    <Box visibleFrom="sm">
      <TodoFilters filter={filter} onFilterChange={onFilterChange} />
    </Box>
    <Button variant="transparent" onClick={onClearCompleted} className={styles.clear}>
      Clear Completed
    </Button>
  </div>
);
