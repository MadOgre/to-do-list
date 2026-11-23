import { errorBodySchema, type ErrorOutcome } from "@to-do-list/common";
import { isAxiosError } from "axios";

// The text that people see for each error outcome of the API. The API's own message is for developers.
// The Record type needs a text for every code, so a new code in common/ fails the build until it has one.
const ERROR_TEXTS: Record<ErrorOutcome, string> = {
  not_found: "This todo no longer exists. The list now shows your current todos.",
  version_conflict: "This todo changed in another tab or window. The list now shows its latest state.",
  invalid_id: "This todo's ID isn't valid. Reload the page and try again.",
  invalid_body: "A todo's title must be 1 to 500 characters.",
  invalid_query: "Could not clear the completed todos.",
};

// For an error without the API's error body, such as a network error or a 500.
const FALLBACK_TEXT = "Could not save your change.";

// The text for a failed request: by the outcome in the API's error body, if the response has one.
export const getErrorText = (error: unknown) => {
  if (!isAxiosError(error)) {
    return FALLBACK_TEXT;
  }
  const body = errorBodySchema.safeParse(error.response?.data);
  if (!body.success) {
    return FALLBACK_TEXT;
  }
  return ERROR_TEXTS[body.data.outcome];
};
