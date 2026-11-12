// Runs the built function (dist/index.mjs) with a sample event, the way Lambda would.
// Usage, in api/: pnpm invoke sample-events/<resource>/<name>.json
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { readFile } from "node:fs/promises";

import { makeLocalContext } from "../dev/local-context.ts";
import type { handler as sourceHandler } from "../src/index.ts";

// What the bundle exports. TypeScript can't read the bundle's types, so this says it:
// the same handler as in src/index.ts, since the bundle is built from that file.
type Bundle = { handler: typeof sourceHandler };

const eventFile = process.argv[2];
if (eventFile === undefined) {
  throw new Error("usage, in api/: pnpm invoke sample-events/<resource>/<name>.json");
}

const eventText = await readFile(eventFile, "utf8");
const event = JSON.parse(eventText) as APIGatewayProxyEventV2;

// The bundle's address, worked out from this file's own location.
const bundleUrl = new URL("../dist/index.mjs", import.meta.url);
const bundle = (await import(bundleUrl.href)) as Bundle;

const result = await bundle.handler(event, makeLocalContext("local-request"));
console.log(JSON.stringify(result, null, 2));
