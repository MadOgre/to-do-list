import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import type { RequestOutcomeCode } from "./outcome-codes.ts";

// What every route handler returns: the response, plus what to log about it.
export type Result = {
  outcome: RequestOutcomeCode;
  message: string;
  response: APIGatewayProxyStructuredResultV2;
};

// Every route handler has this shape, so the router can call any of them the same way.
export type RouteHandler = (event: APIGatewayProxyEventV2) => Promise<Result>;
