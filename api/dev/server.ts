// The local dev server: runs the real router (src/index.ts) on your machine.
// Express plays API Gateway's part: it matches routes.json's routes, builds the event
// the function would get, and turns the function's result into an HTTP response.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";
import express, { type NextFunction, type Request, type Response } from "express";
import { randomUUID } from "node:crypto";

import routesJson from "../routes.json" with { type: "json" };
import { handler } from "../src/index.ts";
import type { Route } from "../src/route-handler-types.ts";

// The type is written out because TypeScript infers never[] for an empty routes.json.
const routes: Route[] = routesJson;

const { PORT } = process.env;
if (!PORT) {
  throw new Error("PORT environment variable must be set (see api/.env.example)");
}

const NOT_LOGGED_IN_MESSAGE =
  "Not logged in to AWS. Run `aws login` in another terminal, then try your request again. If it still fails, restart the server.";

// Warn at startup when AWS credentials can't be loaded, and keep running: logging in usually fixes it without a restart.
// This only loads them: no request goes to AWS.
try {
  await new DynamoDBClient().config.credentials();
} catch {
  console.error(NOT_LOGGED_IN_MESSAGE);
}

// A login can also end while the server runs. These errors say so:
// the first when credentials can't be loaded, the others when AWS rejects them.
const CREDENTIALS_ERROR_NAMES = ["CredentialsProviderError", "ExpiredTokenException", "UnrecognizedClientException"];

const isCredentialsError = (error: unknown) => error instanceof Error && CREDENTIALS_ERROR_NAMES.includes(error.name);

type ExpressMethod = "get" | "put" | "post" | "delete" | "patch";

// routes.json writes path variables as {id}; Express writes them as :id.
const toExpressPath = (path: string) => path.replaceAll("{", ":").replaceAll("}", "");

// Header values Node gives as arrays are joined with commas, as API Gateway does.
const toEventHeaders = (req: Request) => {
  const headers: Record<string, string> = {};
  for (const [name, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      headers[name] = Array.isArray(value) ? value.join(",") : value;
    }
  }
  return headers;
};

const toEvent = (req: Request, routeKey: string, requestId: string): APIGatewayProxyEventV2 => {
  const url = new URL(req.originalUrl, "http://localhost");
  const now = new Date();

  const event: APIGatewayProxyEventV2 = {
    version: "2.0",
    routeKey,
    rawPath: url.pathname,
    rawQueryString: url.search.slice(1),
    headers: toEventHeaders(req),
    requestContext: {
      accountId: "local",
      apiId: "local",
      domainName: req.get("host") ?? "localhost",
      domainPrefix: "localhost",
      http: {
        method: req.method,
        path: url.pathname,
        protocol: `HTTP/${req.httpVersion}`,
        sourceIp: req.ip ?? "",
        userAgent: req.get("user-agent") ?? "",
      },
      requestId,
      routeKey,
      stage: "$default",
      time: now.toISOString(),
      timeEpoch: now.getTime(),
    },
    isBase64Encoded: false,
  };

  // Duplicate query parameters are joined with commas, as API Gateway does.
  if (url.search !== "") {
    const query: Record<string, string> = {};
    for (const name of url.searchParams.keys()) {
      query[name] = url.searchParams.getAll(name).join(",");
    }
    event.queryStringParameters = query;
  }

  // Express types a path variable as a string, or a list for wildcard paths, which routes.json doesn't use.
  const pathParameters: Record<string, string> = {};
  for (const [name, value] of Object.entries(req.params)) {
    if (typeof value === "string") {
      pathParameters[name] = value;
    }
  }
  if (Object.keys(pathParameters).length > 0) {
    event.pathParameters = pathParameters;
  }

  // express.raw gives the body as bytes (a Buffer), or undefined when there's none.
  if (Buffer.isBuffer(req.body) && req.body.length > 0) {
    if (req.is("text/*")) {
      event.body = req.body.toString("utf8");
    } else {
      event.body = req.body.toString("base64");
      event.isBase64Encoded = true;
    }
  }

  return event;
};

// A stand-in for the context Lambda passes: only the fields the logger reads.
const makeContext = () =>
  ({
    functionName: "to-do-list-api-local",
    functionVersion: "$LATEST",
    invokedFunctionArn: "local",
    memoryLimitInMB: "512",
    awsRequestId: randomUUID(),
  }) as Context;

const sendResult = (res: Response, result: APIGatewayProxyStructuredResultV2) => {
  res.status(result.statusCode ?? 200);
  for (const [name, value] of Object.entries(result.headers ?? {})) {
    res.setHeader(name, String(value));
  }
  if (result.body === undefined) {
    res.end();
    return;
  }
  // res.end, not res.send: send would add a content type and an ETag the real API doesn't.
  res.end(result.isBase64Encoded ? Buffer.from(result.body, "base64") : result.body);
};

// API Gateway's own answers, such as {"message":"Not Found"}.
const sendGatewayError = (res: Response, statusCode: number, message: string) => {
  res.status(statusCode).setHeader("content-type", "application/json").end(JSON.stringify({ message }));
};

const app = express();
app.disable("x-powered-by");
app.use(express.raw({ type: () => true, limit: "6mb" }));

for (const route of routes) {
  const routeKey = `${route.method} ${route.path}`;
  const method = route.method.toLowerCase() as ExpressMethod;

  app[method](toExpressPath(route.path), async (req: Request, res: Response) => {
    const requestId = randomUUID();
    res.setHeader("apigw-requestid", requestId);
    const result = await handler(toEvent(req, routeKey, requestId), makeContext());
    sendResult(res, result);
  });
}

// No route matched: API Gateway answers 404 without calling the function.
app.use((req: Request, res: Response) => {
  res.setHeader("apigw-requestid", randomUUID());
  sendGatewayError(res, 404, "Not Found");
});

// The function threw: API Gateway answers 500, and the error is only in the logs.
// Express treats a function as an error handler only when it takes four parameters, so `next` stays unused.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (isCredentialsError(error)) {
    console.error(NOT_LOGGED_IN_MESSAGE);
  } else {
    console.error(error);
  }
  sendGatewayError(res, 500, "Internal Server Error");
});

app.listen(Number(PORT), (error) => {
  if (error) {
    throw error;
  }
  console.log(`Local API on http://localhost:${PORT}`);
});
