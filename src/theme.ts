import { Button, Card, colorsTuple, createTheme, type CSSVariablesResolver } from "@mantine/core";

import classes from "./theme.module.scss";

// The style guide's colors (docs/planning/todo-list-mvp/design/STYLEGUIDE.md), by their names there.
const styleGuide = {
  blue500: "hsl(220, 98%, 61%)",
  white: "hsl(0, 0%, 100%)",
  gray50: "hsl(0, 0%, 98%)",
  gray300: "hsl(233, 11%, 84%)",
  gray600: "hsl(236, 9%, 61%)",
  navy850: "hsl(235, 19%, 35%)",
  navy900: "hsl(235, 24%, 19%)",
  navy950: "hsl(235, 21%, 11%)",
  purple100: "hsl(236, 33%, 92%)",
  purple300: "hsl(234, 39%, 85%)",
  purple600: "hsl(235, 16%, 43%)",
  purple700: "hsl(233, 14%, 35%)",
  purple800: "hsl(237, 14%, 26%)",
  checkBackground: "linear-gradient(135deg, hsl(192, 100%, 67%), hsl(280, 87%, 65%))",
};

const fontFamily = "\"Josefin Sans\", sans-serif";

// Mantine's theme. Set only what we deliberately choose; everything else follows Mantine's defaults.
export const theme = createTheme({
  colors: {
    brand: colorsTuple(styleGuide.blue500),
  },
  primaryColor: "brand",
  fontFamily,
  // Mantine's headings have their own font family, so the font is set for both.
  headings: { fontFamily },
  // The design's cards have 5px corners.
  defaultRadius: 5,
  components: {
    Button: Button.extend({ classNames: { label: classes.buttonLabel } }),
    Card: Card.extend({ classNames: { root: classes.card } }),
  },
});

// The light and dark surface and text colors, as the Figma frames use them. `body` is the card color, because Mantine's
// Paper and Modal use it, and Card does through the theme above. `page` (the page background), `completed` (a Completed
// Todo's title), the cards' `shadow-card` and `gradient-check` (a Completed Todo's check) are our own; `shadow="card"` on
// a Card or Paper uses it.
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {
    "--mantine-gradient-check": styleGuide.checkBackground,
  },
  light: {
    "--mantine-color-page": styleGuide.gray50,
    "--mantine-color-body": styleGuide.white,
    "--mantine-color-text": styleGuide.navy850,
    "--mantine-color-dimmed": styleGuide.gray600,
    "--mantine-color-placeholder": styleGuide.gray600,
    "--mantine-color-completed": styleGuide.gray300,
    "--mantine-color-default-border": styleGuide.purple300,
    "--mantine-shadow-card": "0 35px 25px rgba(194, 195, 214, 0.5)",
  },
  dark: {
    "--mantine-color-page": styleGuide.navy950,
    "--mantine-color-body": styleGuide.navy900,
    "--mantine-color-text": styleGuide.purple100,
    "--mantine-color-dimmed": styleGuide.purple600,
    "--mantine-color-placeholder": styleGuide.gray600,
    "--mantine-color-completed": styleGuide.purple700,
    "--mantine-color-default-border": styleGuide.purple800,
    "--mantine-shadow-card": "0 35px 25px rgba(0, 0, 0, 0.5)",
  },
});
