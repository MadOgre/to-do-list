import type { APIGatewayProxyEventV2 } from "aws-lambda";
import * as z from "zod";

import { errorResult } from "./responses.ts";
import type { Result } from "./route-handler.ts";

// What readJsonBody gives back: the checked body, or the 400 result for the route handler to return.
type BodyCheck<Body> = { ok: true; body: Body } | { ok: false; result: Result };

// The request body as text. API Gateway and the dev server send some bodies in base64.
const getBodyText = (event: APIGatewayProxyEventV2) => {
  if (event.body === undefined) {
    return undefined;
  }
  if (event.isBase64Encoded) {
    return Buffer.from(event.body, "base64").toString("utf8");
  }
  return event.body;
};

// Reads the request body as JSON, and checks it against the route's schema from @to-do-list/common.
export const readJsonBody = <Body>(event: APIGatewayProxyEventV2, schema: z.ZodType<Body>): BodyCheck<Body> => {
  const text = getBodyText(event);
  if (text === undefined) {
    return { ok: false, result: errorResult(400, "invalid_body", "the body is missing") };
  }

  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { ok: false, result: errorResult(400, "invalid_body", "the body isn't JSON") };
  }

  const check = schema.safeParse(value);
  if (!check.success) {
    return { ok: false, result: errorResult(400, "invalid_body", z.prettifyError(check.error)) };
  }

  return { ok: true, body: check.data };
};
