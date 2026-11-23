import type { ErrorBody, ErrorOutcome } from "@to-do-list/common";
import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import type { Result } from "./route-handler.ts";

const JSON_CONTENT_TYPE = "application/json";

const buildResponse = (
  statusCode: number,
  body: string,
  contentType: string,
): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: {
    "content-type": contentType,
  },
  body,
});

export const json = (statusCode: number, body: unknown) =>
  buildResponse(statusCode, JSON.stringify(body), JSON_CONTENT_TYPE);

export const noContent = () => ({ statusCode: 204 });

// A failed request's whole result: the same outcome and message in the log line and in the error body.
export const errorResult = (statusCode: number, outcome: ErrorOutcome, message: string): Result => {
  const body: ErrorBody = { outcome, message };
  return { outcome, message, response: json(statusCode, body) };
};
