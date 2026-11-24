import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";

import type { RouteHandler } from "../route-handler-tools/route-handler.ts";
import * as handlers from "./handler-registry.ts";
import { logger } from "./logger.ts";
import { routes } from "./routes.ts";

// `import * as` gives one object with a key for each export of handler-registry.ts,
// so the route handlers can be looked up by the name that routes.json gives them.
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
  // resource_id: the ID in the path, whatever its name, such as {todo_id}. Every route has at most one.
  const resourceId = Object.values(event.pathParameters ?? {})[0];
  logger.appendKeys({ route: event.routeKey, resource_id: resourceId });

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
