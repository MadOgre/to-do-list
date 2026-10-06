import { ActionIcon, Image, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import type { FC } from "react";

import { moonIcon, sunIcon } from "@/images";

import styles from "./ThemeToggle.module.scss";

// Shows the moon in light and the sun in dark, as in the design. The color scheme may be "auto", so the icon follows the computed one.
export const ThemeToggle: FC = () => {
  const { setColorScheme } = useMantineColorScheme();
  const isDark = useComputedColorScheme("light", { getInitialValueInEffect: false }) === "dark";

  return (
    <ActionIcon
      variant="transparent"
      size="lg"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setColorScheme(isDark ? "light" : "dark")}
    >
      <Image src={isDark ? sunIcon : moonIcon} alt="" className={styles.icon} />
    </ActionIcon>
  );
};
