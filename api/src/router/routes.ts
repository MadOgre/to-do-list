import routesJson from "../../routes.json" with { type: "json" };

// The HTTP methods a route can use. The startup check below checks routes.json against them.
export type HttpMethod = "GET" | "PUT" | "POST" | "DELETE" | "PATCH";

// One entry in routes.json: the HTTP method and path, and the name of the route handler that answers them.
export type Route = {
  method: HttpMethod;
  path: string;
  handler: string;
};

// The methods a route in routes.json can use.
const HTTP_METHODS: HttpMethod[] = ["GET", "PUT", "POST", "DELETE", "PATCH"];

const isHttpMethod = (method: string): method is HttpMethod => HTTP_METHODS.some((known) => known === method);

// The type is written out because TypeScript infers never[] for an empty routes.json.
const routesFromFile: { method: string; path: string; handler: string }[] = routesJson;

// Startup check: every route in routes.json uses one of those methods.
// It runs once, when the code loads, so a typo such as "GTE" stops the function and the dev server at once.
export const routes: Route[] = routesFromFile.map((route) => {
  if (!isHttpMethod(route.method)) {
    throw new Error(
      `routes.json: unknown method ${route.method} for ${route.path}; use one of ${HTTP_METHODS.join(", ")}`,
    );
  }
  return { ...route, method: route.method };
});
