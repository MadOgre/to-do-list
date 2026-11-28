import { describe, expect, it } from "vitest";

import { dynamoDbClientConfig } from "../../src/database/dynamodb-client-config.ts";

describe("dynamoDbClientConfig", () => {
  it("sends the client to DynamoDB Local, with fake credentials and region, for local", () => {
    expect(dynamoDbClientConfig("local")).toEqual({
      endpoint: "http://localhost:8000",
      region: "local",
      credentials: { accessKeyId: "local", secretAccessKey: "local" },
    });
  });

  it("leaves the client on the real DynamoDB in AWS for dev", () => {
    expect(dynamoDbClientConfig("dev")).toEqual({});
  });

  it("leaves the client on the real DynamoDB in AWS when no database is set, as in the deployed Lambda", () => {
    expect(dynamoDbClientConfig(undefined)).toEqual({});
  });
});
