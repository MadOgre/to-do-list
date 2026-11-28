# Standards review, ticket 05

No hard findings. Import order, quotes, arrow functions, named exports, and the docs/structure.md update follow the rules. Lint covers the rest.

S1 (judgment, new): api/dev/reset-local-db.ts, startDynamoDbLocal. Possible Duplicated Code. The java command line repeats dev:db in api/package.json. Port 8000 and the flags can drift. The comment names the copy. Plainer fix: leave it, or call a shared script. Leaving it is acceptable.

S2 (judgment, new): api/dev/reset-local-db.ts, error message "within 10 seconds". Duplicated Code. START_TIMEOUT_MS holds the same number. Build the text from the constant.

S3 (judgment, new): api/dev/reset-local-db.ts, bottom `else` branch. The `answered` flag is tested twice (inside try, then after finally). A reader must follow both. Plainer fix: handle the not-answered case first (stop the process, print the error, set exitCode, return), then run the reset in try/finally.
