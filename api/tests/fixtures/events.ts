import type { APIGatewayProxyEventV2 } from "aws-lambda";

// The parts of an event that a route handler reads. Each test gives only the parts it needs.
interface EventParts {
  routeKey: string;
  body?: string;
  pathParameters?: Record<string, string>;
  queryStringParameters?: Record<string, string>;
}

// A whole API Gateway event, as the router passes it to a route handler.
// The fixed values fill the fields that every event must have, and that no route handler reads.
export const makeEvent = ({ routeKey, body, pathParameters, queryStringParameters }: EventParts) => {
  const [method = "GET", path = "/"] = routeKey.split(" ");

  const event: APIGatewayProxyEventV2 = {
    version: "2.0",
    routeKey,
    rawPath: path,
    rawQueryString: "",
    headers: {},
    requestContext: {
      accountId: "test",
      apiId: "test",
      domainName: "test",
      domainPrefix: "test",
      http: { method, path, protocol: "HTTP/1.1", sourceIp: "", userAgent: "" },
      requestId: "test-request",
      routeKey,
      stage: "$default",
      time: "",
      timeEpoch: 0,
    },
    isBase64Encoded: false,
  };

  // exactOptionalPropertyTypes: an optional field is left out, never set to undefined.
  if (body !== undefined) {
    event.body = body;
  }
  if (pathParameters !== undefined) {
    event.pathParameters = pathParameters;
  }
  if (queryStringParameters !== undefined) {
    event.queryStringParameters = queryStringParameters;
  }
  return event;
};
