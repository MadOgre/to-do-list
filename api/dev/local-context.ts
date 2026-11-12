import type { Context } from "aws-lambda";

// A stand-in for the context Lambda passes: only the fields the logger reads.
// The dev server and the invoke script both use it, so the logs show the same function name.
export const makeLocalContext = (awsRequestId: string) =>
  ({
    functionName: "to-do-list-api-local",
    functionVersion: "$LATEST",
    invokedFunctionArn: "local",
    memoryLimitInMB: "512",
    awsRequestId,
  }) as Context;
