# Standards review, ticket 04

No hard findings.

S1 (judgment, new): api/dev/seeds/todos.ts:113. The literal "demo-owner" repeats DEMO_OWNER_ID from api/src/resources/todos/todos-repository.ts (Duplicated Code). A comment points to the constant, but the two can drift. Import the constant if the dev folder may import from src; otherwise leave it, since the comment documents the link.

S2 (judgment, new): api/dev/reset-local-db.ts:92-97. Nested loops with a mutable counter. Acceptable and plain; the only note is that sequential puts are fine at 6 items. Recommend leaving it.
