// Loads routes.json and checks it at startup. The routes themselves are in api/routes.json: add or change a route there.
import * as z from "zod";

import routesJson from "../../routes.json" with { type: "json" };

// The HTTP methods a route can use.
const httpMethodSchema = z.enum(["GET", "PUT", "POST", "DELETE", "PATCH"]);

export type HttpMethod = z.infer<typeof httpMethodSchema>;

// One entry in routes.json: the HTTP method and path, and the name of the route handler that answers them.
const routeSchema = z.object({
  method: httpMethodSchema,
  path: z.string(),
  handler: z.string(),
});

// Startup check: every entry in routes.json has a known method, a path and a handler name.
// It runs once, when the code loads, so a typo such as "GTE" stops the function and the dev server at once.
const check = z.array(routeSchema).safeParse(routesJson);
if (!check.success) {
  throw new Error(`routes.json: ${z.prettifyError(check.error)}`);
}

export const routes = check.data;
