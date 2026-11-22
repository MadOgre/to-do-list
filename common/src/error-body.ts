import * as z from "zod";

// Every way a request can fail with a body from the API. The "outcome" key of the error body and of the log line is
// one of these codes. A 500 has no code here: the API throws, and API Gateway sends its own body.
export const errorOutcomeSchema = z.enum([
  "not_found",        // any request with an ID: 404, nothing with that ID.
  "version_conflict", // change one item by ID: 409, the item changed after the client read it.
  "invalid_id",       // any request with an ID: 400, the ID breaks its resource's ID rule.
  "invalid_body",     // create or change: 400, the body isn't JSON, or doesn't match the resource's schema.
]);

export type ErrorOutcome = z.infer<typeof errorOutcomeSchema>;

// The body of every error response from the API. The client picks its text for people by the outcome.
// The message is for developers, and its wording may change.
export const errorBodySchema = z.object({
  outcome: errorOutcomeSchema,
  message: z.string(),
});

export type ErrorBody = z.infer<typeof errorBodySchema>;
