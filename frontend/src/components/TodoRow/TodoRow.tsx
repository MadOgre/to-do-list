import { ActionIcon, Checkbox, type CheckboxIconComponent, Group, Text } from "@mantine/core";
import type { FC } from "react";

import { checkIcon, crossIcon } from "@/images";
import type { Todo } from "@/interfaces";

import styles from "./TodoRow.module.scss";

export interface TodoRowProps {
  todo: Todo;
  onToggle: (completed: boolean) => void;
  onDelete: () => void;
}

// The design's tick in place of Mantine's, keeping Mantine's icon class and its show/hide transition.
// A plain <img>: Mantine's Image sets `width: 100%`, and the tick should keep the SVG's own size.
const CheckIcon: CheckboxIconComponent = ({ className }) => <img src={checkIcon} alt="" className={className} />;

// Only the check and the gutter around it toggle the Todo. The title stays outside the label, so clicking it does nothing.
export const TodoRow: FC<TodoRowProps> = ({ todo: { title, completed }, onToggle, onDelete }) => (
  <Group wrap="nowrap" gap={0} align="stretch" className={styles.row}>
    <label className={styles.gutter}>
      <Checkbox
        aria-label={title}
        checked={completed}
        onChange={(event) => onToggle(event.currentTarget.checked)}
        radius="xl"
        icon={CheckIcon}
        classNames={{ root: styles.checkbox, input: styles.input, icon: styles.icon }}
      />
    </label>
    <Text fz="inherit" lh="inherit" td={completed ? "line-through" : undefined} mod={{ completed }} className={styles.title}>
      {title}
    </Text>
    {/* Shown on the hovered or focused row with a mouse, and always on touch screens (see the SCSS module). */}
    <ActionIcon variant="transparent" aria-label={`Delete “${title}”`} onClick={onDelete} className={styles.delete}>
      <img src={crossIcon} alt="" className={styles.cross} />
    </ActionIcon>
  </Group>
);
