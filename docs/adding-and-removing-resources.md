# Adding and Removing Resources

A resource is one kind of thing the API stores and serves, such as todos. Each resource has its own folders, its own DynamoDB table, plus a few lines in shared files. The router (`api/src/index.ts`), the response builders, the logger and Terraform's route block are shared by every resource and don't change.

The examples add a resource called `articles`, with one route, `GET /api/articles/{id}`, and its handler `getArticle`. Other routes follow the same pattern.

## Where a resource lives

| Place | What the resource has there |
| --- | --- |
| `api/package.json` | The DynamoDB packages, which the first resource adds. |
| `api/src/<resource>/` | One file per route, its ID rule and its repository. |
| `api/routes.json` | One entry per route. |
| `api/src/resource-handlers.ts` | One export line per handler. |
| `api/src/request-outcome-codes.ts` | Only the codes it alone uses, if any. |
| `api/sample-events/<resource>/` | One sample event per route, for `pnpm invoke`. |
| `api/.env.example` | Its table's variable. |
| `infra/modules/app/dynamodb.tf` | Its table. |
| `infra/modules/app/main.tf` | Its table's policy, and its table's variable in the function. |
| `docs/structure.md` | Its folders and its table. |

## Adding a resource

### 1. The packages, for the first resource only

The first resource brings the DynamoDB packages: `@aws-sdk/lib-dynamodb` and `dynamodb-toolbox`. Replace `XXXXXXX` with the version of `@aws-sdk/client-dynamodb` in `api/package.json`, so the two AWS SDK packages match. Add them to the API's dependencies, from the repo root, with your dev server stopped:

```sh
pnpm --filter @to-do-list/api add @aws-sdk/lib-dynamodb@XXXXXXX dynamodb-toolbox
```

### 2. The code, in `api/src/articles/`

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

One file per route, such as `get-article.ts`. Each exports a `RouteHandler` (from `api/src/route-handler-types.ts`) that takes the whole event and returns a `Result`: the outcome code, a message for the log, and the response.

```ts
import { json } from "../response-builders.ts";
import type { RouteHandler } from "../route-handler-types.ts";
import { isValidArticleId } from "./article-id.ts";
import { findArticle } from "./articles-repository.ts";

export const getArticle: RouteHandler = async (event) => {
  const id = event.pathParameters?.id;
  if (!isValidArticleId(id)) {
    return {
      outcome: "invalid_id",
      message: "the ID isn't 1 to 64 letters, digits or hyphens",
      response: json(400, { error: "the id must be 1 to 64 letters, digits or hyphens" }),
    };
  }

  const article = await findArticle(id);
  if (article === null) {
    return {
      outcome: "not_found",
      message: `no article with ID ${id}`,
      response: json(404, { error: "article not found", id }),
    };
  }

  return {
    outcome: "found",
    message: "article found",
    response: json(200, article),
  };
};
```

### 3. The routes and the handlers

Add one entry per route to `api/routes.json`. Name the path parameter `{id}`: the router logs `pathParameters.id` as the `resource_id` key. Every path starts with `/api`, the prefix that the frontend's requests use.

```json
[
  { "method": "GET", "path": "/api/articles/{id}", "handler": "getArticle" }
]
```

Export each handler from `api/src/resource-handlers.ts`, one line each, sorted by module path, as lint requires. Replace the file's `export {};` with the first one:

```ts
export { getArticle } from "./articles/get-article.ts";
```

### 4. The outcome codes

Reuse the codes that fit (`found`, `not_found`, `invalid_id` and so on): their comments are generic, so `api/src/request-outcome-codes.ts` doesn't change. Add a new code only for an ending no existing code describes, with a generic comment like the others: the kind of request, the status, and what happened.

### 5. The table, its policy and its variable, in `infra/modules/app/`

Add the table to `dynamodb.tf`. Create the file for the first resource. Its name includes the environment, so each environment has its own table. Give it one `attribute` block for each key attribute, and only for those: a non-key attribute fails the plan.

```hcl
resource "aws_dynamodb_table" "articles" {
  name         = "to-do-list-${var.environment}-articles"
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

### 6. The local settings

Add the variable to `api/.env.example`, with a comment, and to your own `api/.env`, so `pnpm dev` and `pnpm invoke` have it. Locally, the code uses the dev environment's table:

```sh
# The articles table, named in infra/modules/app/dynamodb.tf.
ARTICLES_TABLE=to-do-list-dev-articles
```

### 7. Deploy

From the repo root: `pnpm deploy:dev`. Read the plan before answering `yes`. Expect the table, the policy, one route per new entry in `routes.json`, and the function updated. A policy change can take some minutes to reach the function: until then, its requests fail with `AccessDeniedException` (a 500). Wait and try again before you look for a mistake.

### 8. Try it

Add one sample event per route to `api/sample-events/articles/`, such as `get-article.json`:

```json
{
  "routeKey": "GET /api/articles/{id}",
  "rawPath": "/api/articles/first-article",
  "requestContext": { "requestId": "local-get-article" },
  "pathParameters": { "id": "first-article" },
  "isBase64Encoded": false
}
```

Try it from `api/`, after a build: `pnpm invoke sample-events/articles/get-article.json`. `pnpm invoke` uses the real table: an event that writes or deletes changes real data.

You can also run `pnpm dev` from the repo root and send requests with curl: the local server reads `routes.json`, so the new routes work there with no other change. Both run with your credentials, so a missing permission works locally and fails only in AWS.

### 9. The docs

Update `docs/structure.md`.

### What catches mistakes

- `pnpm typecheck` (part of `pnpm deploy:dev`): a handler that doesn't match `RouteHandler`, or an outcome code that isn't in `RequestOutcomeCode`.
- The startup check in `api/src/index.ts`: a `routes.json` entry whose handler isn't exported. Every route then answers 500, and the function's log says `routes.json: no handler named …`.
- The repository's startup check: a missing `ARTICLES_TABLE` stops the function, and every route answers 500.
- Nothing catches an exported handler that no route names. It's never called.
- Nothing catches a missing permission before a request uses it: the function's log says `is not authorized to perform: dynamodb:…`, with the action and the ARN.

## Removing a resource

1. Remove its entries from `api/routes.json` and its lines from `api/src/resource-handlers.ts`, in the same change. Removing only the exports breaks every route at startup. If no handler is left, put back `export {};`.
2. Delete `api/src/articles/` and `api/sample-events/articles/`.
3. In `api/src/request-outcome-codes.ts`, remove the codes no other resource uses. TypeScript doesn't warn about unused codes: check each one with `grep -rn '"XXXXXXX"' api/src`, with the code in place of `XXXXXXX`.
4. In `infra/modules/app/`, remove its table from `dynamodb.tf`, and its policy and its variable from `main.tf`. Remove the variable from `api/.env.example` and `api/.env` too.
5. Deploy: `pnpm deploy:dev`. Read the plan before answering `yes`: the table and the policy destroyed, one route destroyed per removed entry, and the function updated. **Destroying the table deletes every item in it.** No undo. See [Its data goes with the table](#its-data-goes-with-the-table).
6. If it was the last resource, also delete `infra/modules/app/dynamodb.tf`, and remove `@aws-sdk/lib-dynamodb` and `dynamodb-toolbox` from the API, with your dev server stopped: `pnpm --filter @to-do-list/api remove @aws-sdk/lib-dynamodb dynamodb-toolbox`.
7. Update `docs/structure.md`.

## Its data goes with the table

A resource's items live only in its table, so removing the table removes the data. To keep a copy, save the items to a file before you deploy the removal:

```sh
aws dynamodb scan --table-name to-do-list-dev-articles > articles-backup.json
```

The file has the items in DynamoDB's typed JSON. To keep the data in AWS instead, keep the table: remove the code and the routes first, and the table in a later change.
