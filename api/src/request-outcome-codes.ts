// Every way a request can end. The "outcome" key in each log line is one of these codes.
export type RequestOutcomeCode =
  | "listed"           // list the items: 200, with the items.
  | "found"            // get one item by ID: 200, with the item.
  | "created"          // create one item: 201, with the new item.
  | "updated"          // change one item by ID: 200, with the changed item.
  | "deleted"          // delete one item by ID: 204, also when it didn't exist.
  | "cleared"          // delete every item that matches a filter: 204.
  | "not_found"        // any request with an ID: 404, nothing with that ID.
  | "version_conflict" // change one item by ID: 409, the item changed after the client read it.
  | "invalid_id"       // any request with an ID: 400, the ID breaks its resource's ID rule.
  | "invalid_body"     // create or change: 400, the body isn't JSON, or doesn't match the resource's schema.
  | "error";           // any request: 500, something threw. The router logs it as ERROR and throws it again.
