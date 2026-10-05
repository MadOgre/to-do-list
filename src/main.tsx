// Mantine's base styles first, before any import that brings in our SCSS modules (the routes load the Pages),
// so our global and module rules come after Mantine's in the CSS and win where they overlap.
import "@mantine/core/styles.css";
import "@/styles/global.scss";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { queryClient } from "@/queryClient";
import { router } from "@/routes";
import { cssVariablesResolver, theme } from "@/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* "auto" starts from the OS setting; Mantine's default manager remembers the choice in localStorage. */}
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver} defaultColorScheme="auto">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* Rendered only in development; production builds get an empty stub. */}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
);
