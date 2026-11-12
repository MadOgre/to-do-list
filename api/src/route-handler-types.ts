import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import type { RequestOutcomeCode } from "./request-outcome-codes.ts";

// What every handler returns: the response, plus what to log about it.
export type Result = {
  outcome: RequestOutcomeCode;
  message: string;
  response: APIGatewayProxyStructuredResultV2;
};

// The HTTP methods a route can use. src/routes.ts checks routes.json against them at startup.
export type HttpMethod = "GET" | "PUT" | "POST" | "DELETE" | "PATCH";

// One entry in routes.json: the HTTP method and path, and the name of the handler that answers them.
export type Route = {
  method: HttpMethod;
  path: string;
  handler: string;
};

// Every handler has this shape, so the router can call any of them the same way.
export type RouteHandler = (event: APIGatewayProxyEventV2) => Promise<Result>;
