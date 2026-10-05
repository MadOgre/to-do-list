import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { queryClient } from "@/queryClient";
import { router } from "@/routes";
import { theme } from "@/theme";
// Mantine's base styles first, so our global rules win where they overlap.
import "@mantine/core/styles.css";
import "@/styles/global.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* Rendered only in development; production builds get an empty stub. */}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
);
