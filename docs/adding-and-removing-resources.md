# Adding and Removing Resources

A resource is one kind of thing the API stores and serves, such as todos. Each resource has its own folders, its own DynamoDB table, plus a few lines in shared files. The router (`api/src/router/`), the route handler tools (`api/src/route-handler-tools/`) and Terraform's route block are shared by every resource and don't change.

The examples add a resource called `articles`, with one route, `GET /api/articles/{article_id}`, and its handler `getArticle`. Other routes follow the same pattern.

## Where a resource lives

| Place | What the resource has there |
| --- | --- |
| `api/package.json` | Nothing new: the DynamoDB packages are already there, for the todos resource. |
| `api/src/resources/<resource>/` | Its repository and its ID rule, and `route-handlers/`, with one file per route. |
| `common/src/<resource>.ts` | Its schemas: the item and each request body. `common/src/index.ts` exports them. |
| `api/routes.json` | One entry per route. |
| `api/src/router/handler-registry.ts` | One export line per route handler. |
| `api/src/route-handler-tools/outcome-codes.ts`, `common/src/error-body.ts` | Only the codes it alone uses, if any: a success code in the first file, an error code in the second. |
| `api/dev/sample-events/<resource>/` | One sample event per route, for `pnpm invoke`. |
| `api/dev/seeds/<resource>.ts` | Its Seed: each Owner's ID, and that Owner's items, which `pnpm db:reset` writes to the local table. |
| `api/dev/reset-local-db.ts` | About 10 lines: delete its local table, create it again with its keys, and write its Seed. |
| `api/tests/resources/<resource>/` | One test file per route handler, in `route-handlers/`, and a test of its ID rule. |
| `.env.example` | Its table's variable. |
| `infra/modules/app/dynamodb.tf` | Its table. |
| `infra/modules/app/main.tf` | Its table's policy, and its table's variable in the function. |
| `docs/structure.md` | Its folders and its table. |

## Adding a resource

### 1. The packages

The DynamoDB packages (`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb` and `dynamodb-toolbox`) are already in `api/package.json`, so a new resource adds no package.

If the last resource was removed, its removal also removed `@aws-sdk/lib-dynamodb` and `dynamodb-toolbox`. Then add them back. Replace `XXXXXXX` with the version of `@aws-sdk/client-dynamodb` in `api/package.json`, so the two AWS SDK packages match. Run this from the repo root, with your dev server stopped:

```sh
pnpm --filter @to-do-list/api add @aws-sdk/lib-dynamodb@XXXXXXX dynamodb-toolbox
```

### 2. The code, in `api/src/resources/articles/`

The ID rule, `article-id.ts`. Each handler checks its own ID; the router doesn't.

```ts
// A valid article ID: 1 to 64 letters, digits or hyphens.
const ARTICLE_ID_REGEX = /^[a-zA-Z0-9-]{1,64}$/;

export const isValidArticleId = (id: string | undefined): id is string =>
  typeof id === "string" && ARTICLE_ID_REGEX.test(id);
```

The repository, `articles-repository.ts`: the only file that touches the articles table. It reads the table's name from `ARTICLES_TABLE`, and imports from Toolbox's separate paths (`dynamodb-toolbox/entity` and so on), which keep the bundle smaller than the root import.

```ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Entity } from "dynamodb-toolbox/entity";
import { GetItemCommand } from "dynamodb-toolbox/entity/actions/get";
import { item } from "dynamodb-toolbox/schema/item";
import { string } from "dynamodb-toolbox/schema/string";
import { Table } from "dynamodb-toolbox/table";

const { ARTICLES_TABLE } = process.env;
if (!ARTICLES_TABLE) {
  throw new Error("ARTICLES_TABLE environment variable must be set");
}

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const articlesTable = new Table({
  name: ARTICLES_TABLE,
  partitionKey: { name: "id", type: "string" },
  documentClient,
});

// The table holds only articles, so Toolbox's _et attribute adds nothing.
// Without _et, _ct and _md, items that the CLI writes read the same as items that this code writes.
const Article = new Entity({
  name: "Article",
  table: articlesTable,
  entityAttribute: false,
  timestamps: false,
  schema: item({
    id: string().key(),
    title: string(),
  }),
});

// The article, or null when there's no article with that ID.
export const findArticle = async (id: string) => {
  const { Item } = await Article.build(GetItemCommand).key({ id }).send();
  return Item ?? null;
};
```

One file per route, in `route-handlers/`, such as `route-handlers/get-article.ts`. Name the file after its route handler. Each exports a `RouteHandler` (from `api/src/route-handler-tools/route-handler.ts`) that takes the whole event and returns a `Result`: the outcome code, a message for the log, and the response.

```ts
import { errorResult, json } from "../../../route-handler-tools/responses.ts";
import type { RouteHandler } from "../../../route-handler-tools/route-handler.ts";
import { isValidArticleId } from "../article-id.ts";
import { findArticle } from "../articles-repository.ts";

export const getArticle: RouteHandler = async (event) => {
  const articleId = event.pathParameters?.article_id;
  if (!isValidArticleId(articleId)) {
    return errorResult(400, "invalid_id", "the ID isn't 1 to 64 letters, digits or hyphens");
  }

  const article = await findArticle(articleId);
  if (article === null) {
    return errorResult(404, "not_found", `no article with ID ${articleId}`);
  }

  return {
    outcome: "found",
    message: "article found",
    response: json(200, article),
  };
};
```

A route with a body checks it with `readJsonBody` (from `api/src/route-handler-tools/json-body.ts`) and the route's schema from `@to-do-list/common`. On a bad body, `readJsonBody` gives the whole 400 result, so the handler returns it as it is:

```ts
const check = readJsonBody(event, createArticleBodySchema);
if (!check.ok) {
  return check.result;
}
// check.body is the checked body, with the schema's type.
```

The schemas go in `common/src/articles.ts`, one per request body, each with its type from `z.infer`, and `common/src/index.ts` exports them. The frontend uses the same types. See `common/src/todos.ts` for an example.

### 3. The routes and the handlers

Add one entry per route to `api/routes.json`. The method is one of `GET`, `PUT`, `POST`, `DELETE` and `PATCH`: `api/src/router/routes.ts` checks it at startup. Name the path parameter after the resource, such as `{article_id}`. The router logs the first path parameter as the `resource_id` key, whatever its name, so give a route at most one. Every path starts with `/api`, the prefix that the frontend's requests use.

```json
[
  { "method": "GET", "path": "/api/articles/{article_id}", "handler": "getArticle" }
]
```

Export each route handler from `api/src/router/handler-registry.ts`, one line each, sorted by module path, as lint requires. If the file has only `export {};` (no resource is left), replace that line with the first export:

```ts
export { getArticle } from "../resources/articles/route-handlers/get-article.ts";
```

### 4. The tests, in `api/tests/resources/articles/`

Add one test file per route handler, at the same path as the route handler under `api/tests/`, with `.test` before `.ts`: `route-handlers/get-article.test.ts`. `pnpm test` finds every `*.test.ts` file in `api/tests/`.

The test replaces the repository with `vi.mock`, so no test talks to DynamoDB, and the real file's `ARTICLES_TABLE` check never runs. The factory returns every export of the repository that the route handler uses, each function as `vi.fn()`. Each test sets the repository's answer with `mockResolvedValue`, and builds its event with `makeEvent` from `api/tests/fixtures/events.ts`. Test each response the route handler can give: here 200, 404 and 400.

```ts
import { describe, expect, it, vi } from "vitest";

import * as articlesRepository from "../../../../src/resources/articles/articles-repository.ts";
import { getArticle } from "../../../../src/resources/articles/route-handlers/get-article.ts";
import { makeEvent } from "../../../fixtures/events.ts";

// The route handler gets these exports in place of the real repository, so no test talks to DynamoDB.
vi.mock("../../../../src/resources/articles/articles-repository.ts", () => ({
  findArticle: vi.fn(),
}));

const ROUTE_KEY = "GET /api/articles/{article_id}";

describe("getArticle", () => {
  it("answers 200 with the article", async () => {
    const article = { id: "first-article", title: "Hello" };
    vi.mocked(articlesRepository.findArticle).mockResolvedValue(article);

    const result = await getArticle(makeEvent({ routeKey: ROUTE_KEY, pathParameters: { article_id: "first-article" } }));

    expect(articlesRepository.findArticle).toHaveBeenCalledWith("first-article");
    expect(result.response.statusCode).toBe(200);
    expect(JSON.parse(result.response.body ?? "")).toEqual(article);
  });

  it("answers 404 not_found when no article has the ID", async () => {
    vi.mocked(articlesRepository.findArticle).mockResolvedValue(null);

    const result = await getArticle(makeEvent({ routeKey: ROUTE_KEY, pathParameters: { article_id: "missing" } }));

    expect(result.outcome).toBe("not_found");
    expect(result.response.statusCode).toBe(404);
  });

  it("answers 400 invalid_id for an ID with other characters, and reads nothing", async () => {
    const result = await getArticle(makeEvent({ routeKey: ROUTE_KEY, pathParameters: { article_id: "not an id!" } }));

    expect(result.outcome).toBe("invalid_id");
    expect(articlesRepository.findArticle).not.toHaveBeenCalled();
  });
});
```

Test the ID rule too, in `article-id.test.ts`, as `api/tests/resources/todos/todo-id.test.ts` does. The repository itself has no tests yet: they need a real table.

### 5. The outcome codes

Reuse the codes that fit (`found`, `not_found`, `invalid_id` and so on): their comments are generic, so neither file changes. Add a new code only for an ending no existing code describes, with a generic comment like the others: the kind of request, the status, and what happened. A success code goes in `api/src/route-handler-tools/outcome-codes.ts`. An error code goes in `errorOutcomeSchema` in `common/src/error-body.ts`, because the frontend reads it too.

### 6. The table, its policy and its variable, in `infra/modules/app/`

Add the table to `dynamodb.tf`, next to the todos table. If the file doesn't exist (no resource is left), create it. The table's name starts with `local.prefix` (`tdl-<environment>`), so each environment has its own table. Give it one `attribute` block for each key attribute, and only for those: a non-key attribute fails the plan.

The template's table has one key, `id`. The todos table in `dynamodb.tf` is the real example of a table whose items belong to an owner: its partition key is `owner_id`, and its sort key is `todo_id`.

```hcl
resource "aws_dynamodb_table" "articles" {
  name         = "${local.prefix}-articles"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
```

Add the table's policy to `main.tf`, after the role's other policies. Name only the actions that its routes use: `dynamodb:GetItem`, `PutItem`, `UpdateItem`, `DeleteItem`, `Query`, or `Scan` for a list of every item. An index has its own ARN (`…/table/<table>/index/<index>`): name it too if a route queries the index.

```hcl
resource "aws_iam_role_policy" "api_articles_table" {
  name = "articles-table-access"
  role = aws_iam_role.api.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "ReadArticles"
        Effect   = "Allow"
        Action   = ["dynamodb:GetItem"]
        Resource = aws_dynamodb_table.articles.arn
      }
    ]
  })
}
```

Add the table's name to the function's `environment.variables` in `main.tf`:

```hcl
  environment {
    variables = {
      ARTICLES_TABLE = aws_dynamodb_table.articles.name
      NODE_OPTIONS   = "--enable-source-maps"
    }
  }
```

### 7. The local settings

Add the variable to `.env.example`, with a comment, and to your own `.env`, so `pnpm dev` and `pnpm invoke` have it. Locally, the code uses the dev environment's table:

```sh
# The articles table, named in infra/modules/app/dynamodb.tf.
ARTICLES_TABLE=tdl-dev-articles
```

### 8. Deploy

From the repo root: `pnpm deploy:dev`. Read the plan before answering `yes`. Expect the table, the policy, one route per new entry in `routes.json`, and the function updated. A policy change can take some minutes to reach the function: until then, its requests fail with `AccessDeniedException` (a 500). Wait and try again before you look for a mistake.

### 9. Try it

Add one sample event per route to `api/dev/sample-events/articles/`, such as `get-article.json`:

```json
{
  "routeKey": "GET /api/articles/{article_id}",
  "rawPath": "/api/articles/first-article",
  "requestContext": { "requestId": "local-get-article" },
  "pathParameters": { "article_id": "first-article" },
  "isBase64Encoded": false
}
```

Try it from `api/`, after a build: `pnpm invoke dev/sample-events/articles/get-article.json`. `pnpm invoke` uses the real table: an event that writes or deletes changes real data.

You can also run `pnpm dev` from the repo root and send requests with curl: the local server reads `routes.json`, so the new routes work there with no other change. Both run with your credentials, so a missing permission works locally and fails only in AWS.

### 10. The docs

Update `docs/structure.md`.

### What catches mistakes

- `pnpm typecheck` (part of `pnpm deploy:dev`): a handler that doesn't match `RouteHandler`, or an outcome code that isn't in `RequestOutcomeCode`.
- `pnpm test`: a route handler that gives the wrong response for a repository answer or a bad request.
- The startup check in `api/src/router/router.ts`: a `routes.json` entry whose handler isn't exported. Every route then answers 500, and the function's log says `routes.json: no handler named …`.
- The repository's startup check: a missing `ARTICLES_TABLE` stops the function, and every route answers 500.
- Nothing catches an exported handler that no route names. It's never called.
- Nothing catches a missing permission before a request uses it: the function's log says `is not authorized to perform: dynamodb:…`, with the action and the ARN.

## Removing a resource

1. Remove its entries from `api/routes.json` and its lines from `api/src/router/handler-registry.ts`, in the same change. Removing only the exports breaks every route at startup. If no handler is left, put back `export {};`.
2. Delete `api/src/resources/articles/`, `api/tests/resources/articles/`, `api/dev/sample-events/articles/` and `common/src/articles.ts`, and remove its export lines from `common/src/index.ts`.
3. In `api/src/route-handler-tools/outcome-codes.ts` and `common/src/error-body.ts`, remove the codes no other resource uses. TypeScript doesn't warn about unused codes: check each one with `grep -rn '"XXXXXXX"' api/src common/src frontend/src`, with the code in place of `XXXXXXX`.
4. In `infra/modules/app/`, remove its table from `dynamodb.tf`, and its policy and its variable from `main.tf`. Remove the variable from `.env.example` and `.env` too.
5. Deploy: `pnpm deploy:dev`. Read the plan before answering `yes`: the table and the policy destroyed, one route destroyed per removed entry, and the function updated. **Destroying the table deletes every item in it.** No undo. See [Its data goes with the table](#its-data-goes-with-the-table).
6. If it was the last resource, also delete `infra/modules/app/dynamodb.tf`, and remove `@aws-sdk/lib-dynamodb` and `dynamodb-toolbox` from the API, with your dev server stopped: `pnpm --filter @to-do-list/api remove @aws-sdk/lib-dynamodb dynamodb-toolbox`.
7. Update `docs/structure.md`.

## Its data goes with the table

A resource's items live only in its table, so removing the table removes the data. To keep a copy, save the items to a file before you deploy the removal:

```sh
aws dynamodb scan --table-name tdl-dev-articles > articles-backup.json
```

The file has the items in DynamoDB's typed JSON. To keep the data in AWS instead, keep the table: remove the code and the routes first, and the table in a later change.
