// Mantine's base styles load in the packages section, before any `@/` import that brings in our styles
// (global.scss, and the Pages' SCSS modules through the routes). Our rules then come after Mantine's in the CSS
// and win where they overlap.
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import { queryClient } from "@/queryClient";
import { router } from "@/routes";
import "@/styles/global.scss";
import { cssVariablesResolver, theme } from "@/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* "auto" starts from the OS setting; Mantine's default manager remembers the choice in localStorage. */}
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver} defaultColorScheme="auto">
      {/* Renders the dialogs that `modals.openConfirmModal` opens. */}
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {/* Rendered only in development; production builds get an empty stub. */}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>,
);
