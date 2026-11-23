import { notifications } from "@mantine/notifications";
import { MutationCache, QueryClient } from "@tanstack/react-query";

import { getErrorText } from "@/api";

// Every failed change shows its own pop-up message, from this one place. The API Hooks and the Pages don't show
// errors of changes. A failed read shows in the Page, as the useTodos query's isError.
export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => notifications.show({ color: "red", message: getErrorText(error) }),
  }),
});
