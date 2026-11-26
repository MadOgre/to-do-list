import { MantineProvider } from "@mantine/core";
import { render as testingLibraryRender } from "@testing-library/react";
import type { ReactNode } from "react";

import { cssVariablesResolver, theme } from "@/theme";

// Renders a component inside MantineProvider with the app's theme, as main.tsx does.
// Mantine's components need the provider. env="test" turns off Mantine's transitions and portals,
// so a test sees each change at once and inside the rendered component.
export const render = (ui: ReactNode) =>
  testingLibraryRender(
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver} env="test">
      {ui}
    </MantineProvider>,
  );
