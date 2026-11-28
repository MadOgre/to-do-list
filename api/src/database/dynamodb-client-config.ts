import type { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

// DynamoDB Local's fixed address, where pnpm dev starts it (dev:db in api/package.json).
const LOCAL_ENDPOINT = "http://localhost:8000";

// The DynamoDB client's settings for a DATABASE value, from api/.env.
// Only "local" changes them: DynamoDB Local accepts any credentials and region, so fake ones
// mean that no AWS login is needed. Every other value, and no value, as in the deployed Lambda,
// gives the SDK's defaults: the real DynamoDB in AWS. Only the dev server refuses an unknown value.
export const dynamoDbClientConfig = (database: string | undefined): DynamoDBClientConfig => {
  if (database === "local") {
    return {
      endpoint: LOCAL_ENDPOINT,
      region: "local",
      credentials: { accessKeyId: "local", secretAccessKey: "local" },
    };
  }
  return {};
};
