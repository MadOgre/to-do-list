# Standards review, ticket 03

No hard findings. Imports, quotes, arrow functions, named exports and the docs updates (`docs/structure.md`, `api/CLAUDE.md`, `api/.env.example`) follow the written rules. No ruling applies.

## S1 (judgment, new): Primitive Obsession / Repeated Switches
`api/dev/server.ts:20` and `api/src/database/dynamodb-client-config.ts:11`.
The strings "local" and "dev" appear in both files. The server accepts `local` or `dev`. The config function knows only `local`, and treats everything else as AWS. A third value (for example `test`) would need edits in both places (Shotgun Surgery risk). A small shared `Database` type, such as `type Database = "local" | "dev"`, would hold the two values once. The plain fix is small, but the duplication is only two literals and is documented in comments. Leaving it is acceptable.

## Not flagged
- Fake credentials and region literals in the config are explained by a comment. The test repeats the same literals on purpose.
