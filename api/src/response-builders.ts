import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

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
