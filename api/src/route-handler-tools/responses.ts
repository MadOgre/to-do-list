import type { ErrorBody, ErrorOutcome } from "@to-do-list/common";

import type { Result } from "./route-handler.ts";

export const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

export const noContent = () => ({ statusCode: 204 });

// A failed request's whole result: the same outcome and message in the log line and in the error body.
export const errorResult = (statusCode: number, outcome: ErrorOutcome, message: string): Result => {
  const body: ErrorBody = { outcome, message };
  return { outcome, message, response: json(statusCode, body) };
};
