import type { ErrorOutcome } from "@to-do-list/common";

// Every way a request can end. The "outcome" key in each log line is one of these codes.
// The error codes with a body come from common/src/error-body.ts, because the frontend reads them too.
export type RequestOutcomeCode =
  | "listed"           // list the items: 200, with the items.
  | "found"            // get one item by ID: 200, with the item.
  | "created"          // create one item: 201, with the new item.
  | "updated"          // change one item by ID: 200, with the changed item.
  | "deleted"          // delete one item by ID: 204, also when it didn't exist.
  | "cleared"          // delete every item that matches a filter: 204.
  | "restored"         // replace every item with the demo items: 204.
  | ErrorOutcome       // the errors with a body: not_found, version_conflict, invalid_id, invalid_body, invalid_query.
  | "error";           // any request: 500, something threw. The router logs it as ERROR and throws it again.
