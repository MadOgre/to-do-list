import { Button, Group } from "@mantine/core";
import type { FC } from "react";

import type { TodoFilter } from "@/interfaces";

import styles from "./TodoFilters.module.scss";

export interface TodoFiltersProps {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

const filters: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

// The selected filter shows in the primary blue, the others dimmed (see the SCSS module).
export const TodoFilters: FC<TodoFiltersProps> = ({ filter, onFilterChange }) => (
  <Group gap={0} justify="center" wrap="nowrap" className={styles.filters}>
    {filters.map(({ value, label }) => (
      <Button
        key={value}
        variant="transparent"
        aria-pressed={value === filter}
        mod={{ selected: value === filter }}
        onClick={() => onFilterChange(value)}
        className={styles.filter}
      >
        {label}
      </Button>
    ))}
  </Group>
);
