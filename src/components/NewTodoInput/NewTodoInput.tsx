import { TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import type { FC, KeyboardEvent } from "react";

import styles from "./NewTodoInput.module.scss";

export interface NewTodoInputProps {
  // Creates the Todo. The input clears once the returned promise resolves, and keeps the text if it rejects.
  onCreate: (title: string) => Promise<unknown>;
}

export const NewTodoInput: FC<NewTodoInputProps> = ({ onCreate }) => {
  const [value, setValue] = useInputState("");

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const title = value.trim();
    // Enter that ends an IME composition only confirms the typed characters.
    if (event.key !== "Enter" || event.nativeEvent.isComposing || !title) {
      return;
    }
    onCreate(title)
      .then(() => setValue(""))
      .catch(() => {
        // The caller shows the error. Keep the typed text so the user can try again.
      });
  };

  return (
    <TextInput
      aria-label="Create a new todo"
      placeholder="Create a new todo…"
      value={value}
      onChange={setValue}
      onKeyDown={handleKeyDown}
      leftSection={<span className={styles.circle} />}
      classNames={{ input: styles.input, section: styles.section }}
    />
  );
};
