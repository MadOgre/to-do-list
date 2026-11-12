# Logging

How the API's logs work, and how to follow one request through them.

## The two log groups

Each environment has two, named after it. In the dev environment:

- `to-do-list-dev-api-access`: API Gateway's access log. One line per request, including
  requests that never reach the function, such as a 404 for a missing route or a 429.
- `/aws/lambda/to-do-list-dev-api`: the function's log. One outcome line per request, written
  by Powertools Logger, plus Lambda's own records, such as `platform.start` and
  `platform.report`.

Both are kept for 14 days, and both write one JSON object per line.

## Tracing one request

Every response has an `apigw-requestid` header. API Gateway calls this value the request ID.
Both logs store it under the key `correlation_id`, so one filter finds the request in both.

1. Copy `apigw-requestid` from the response (curl's headers, or the browser's devtools,
   Network tab, Response Headers).
2. In the CloudWatch console, under Logs, Log Analytics, choose both log groups and a
   time range. The console writes one `SOURCE` line per log group at the top of the
   query. Keep those lines, and replace everything below them with:

   ```
   fields @timestamp, @log, outcome, status, message
   | filter correlation_id = "PASTE-THE-ID"
   | sort @timestamp asc
   ```

   You get the access log's line and the function's outcome line.
3. From the terminal, one log group at a time:

   ```sh
   RID="PASTE-THE-ID"
   aws logs tail /aws/lambda/to-do-list-dev-api --since 1h --filter-pattern "{ \$.correlation_id = \"$RID\" }"
   ```

To see Lambda's own `platform.start` and `platform.report` records for the same request,
filter the function's log on `record.requestId` with the outcome line's `function_request_id`:
that's Lambda's own ID, and Lambda's records keep it under `record.requestId`.

## The function's outcome line

The router writes it once per request, after the handler returns
(`api/src/index.ts`). Errors are logged at level `ERROR` with `outcome` `error`, then
thrown again, so Lambda counts a failure and the client gets API Gateway's 500.

| Key | What it holds |
| --- | --- |
| `message` | What happened, for people to read. Wording may change; don't filter on it. |
| `outcome` | One fixed code for how the request ended. Filter on this. |
| `status` | The status code returned (a number). |
| `route` | The route key, such as `GET /api/articles/{id}`. |
| `resource_id` | The `{id}` from the path, whatever the resource. Missing on routes without one. |
| `correlation_id` | API Gateway's request ID. |
| `error` | On errors only: the error's `name`, `message` and `stack`. |

Powertools adds `level`, `timestamp`, `service` (`to-do-list-api`, the same in every environment), `sampling_rate`,
`cold_start`, `function_name`, `function_arn`, `function_memory_size` and
`function_request_id` (Lambda's ID for the invocation, not the one to trace by).

## Outcome codes

The full list, with when each happens, is the `RequestOutcomeCode` type in
`api/src/request-outcome-codes.ts`. The code is type-checked against it, so it's always
current. For example, to find every request for a missing item in a Log Analytics query:
`filter outcome = "not_found"`.

## The access log's keys

Set in `infra/modules/app/main.tf`, in the stage's `access_log_settings`.

| Key | What it holds |
| --- | --- |
| `correlation_id` | API Gateway's request ID (`$context.requestId`). |
| `route_key` | The route key API Gateway matched, such as `GET /api/articles/{id}`. |
| `path` | The path the client asked for. |
| `status` | The status sent to the client (a string). |
| `integration_status` | Lambda's answer to API Gateway's call: 200 when the function ran. |
| `function_status` | The status the function returned. |
| `integration_error` | Why the call to Lambda failed, if it did. |
| `gateway_error` | API Gateway's own error, such as `Too Many Requests`. |
| `latency_ms` | How long the whole request took, in milliseconds. |

## IDs that look similar but aren't

- `function_request_id`: Lambda's ID for one invocation.
- `error.$metadata.requestId`: the AWS service's ID for a failed call to that service, such as
  DynamoDB. Useful only with AWS support.
