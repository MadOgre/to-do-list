import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";

import routesJson from "../routes.json" with { type: "json" };
import { logger } from "./logger.ts";
import * as handlers from "./resource-handlers.ts";
import type { Route, RouteHandler } from "./route-handler-types.ts";

// The type is written out because TypeScript infers never[] for an empty routes.json.
const routes: Route[] = routesJson;

// Look handlers up by the name routes.json gives them.
const handlersByName: Record<string, RouteHandler> = handlers;

// Startup check: every route in routes.json names a handler that exists.
// It runs once, when the function loads, so a missing handler stops every request.
const handlersByRouteKey = new Map<string, RouteHandler>();
for (const route of routes) {
  const routeHandler = handlersByName[route.handler];
  if (routeHandler === undefined) {
    throw new Error(`routes.json: no handler named ${route.handler} for ${route.method} ${route.path}`);
  }
  handlersByRouteKey.set(`${route.method} ${route.path}`, routeHandler);
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.resetKeys();
  logger.addContext(context);
  logger.setCorrelationId(event.requestContext.requestId);
  logger.appendKeys({ route: event.routeKey, resource_id: event.pathParameters?.id });

  try {
    const routeHandler = handlersByRouteKey.get(event.routeKey);
    if (routeHandler === undefined) {
      throw new Error(`no handler for route ${event.routeKey}`);
    }

    const result = await routeHandler(event);
    logger.info(result.message, { outcome: result.outcome, status: result.response.statusCode });
    return result.response;
  } catch (error) {
    logger.error("request failed", { outcome: "error", status: 500, error });
    throw error;
  }
};
