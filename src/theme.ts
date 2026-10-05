import { colorsTuple, createTheme, type CSSVariablesResolver } from "@mantine/core";

// The style guide's colours (docs/planning/todo-list-mvp/design/STYLEGUIDE.md), by their names there.
const styleGuide = {
  blue500: "hsl(220, 98%, 61%)",
  white: "hsl(0, 0%, 100%)",
  gray50: "hsl(0, 0%, 98%)",
  gray300: "hsl(233, 11%, 84%)",
  gray600: "hsl(236, 9%, 61%)",
  navy850: "hsl(235, 19%, 35%)",
  navy900: "hsl(235, 24%, 19%)",
  navy950: "hsl(235, 21%, 11%)",
  purple300: "hsl(234, 39%, 85%)",
  purple600: "hsl(235, 16%, 43%)",
  purple700: "hsl(233, 14%, 35%)",
  purple800: "hsl(237, 14%, 26%)",
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
  defaultRadius: "md",
});

// The light and dark surface and text colours. `body` is the card colour, because Mantine's Paper, Card and Modal use it.
// `page` (the page background) and `completed` (a Completed Todo's title) are our own.
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    "--mantine-color-page": styleGuide.gray50,
    "--mantine-color-body": styleGuide.white,
    "--mantine-color-text": styleGuide.navy850,
    "--mantine-color-dimmed": styleGuide.gray600,
    "--mantine-color-placeholder": styleGuide.gray600,
    "--mantine-color-completed": styleGuide.gray300,
    "--mantine-color-default-border": styleGuide.gray300,
  },
  dark: {
    "--mantine-color-page": styleGuide.navy950,
    "--mantine-color-body": styleGuide.navy900,
    "--mantine-color-text": styleGuide.purple300,
    "--mantine-color-dimmed": styleGuide.purple600,
    "--mantine-color-placeholder": styleGuide.purple600,
    "--mantine-color-completed": styleGuide.purple700,
    "--mantine-color-default-border": styleGuide.purple800,
  },
});
