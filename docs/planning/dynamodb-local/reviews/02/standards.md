# Standards review, ticket 02

No hard findings. Two judgment findings.

## S1 (judgment, new, severity -) api/package.json:8, dev:db script
Possible exposure: DynamoDB Local has no `-host` flag here, so it may listen on all interfaces with no authentication. The docs (docs/local-development.md) say only the frontend and the API listen on localhost only, so the docs avoid the claim for DynamoDB Local. Consider whether to bind it to localhost. This is a judgment call, because ADR-0002 does not address it.

## S2 (judgment, new, severity -) docs/local-development.md step 6 (renumbered line)
The "Sign in to AWS" step still says every todos route needs AWS credentials. ADR-0002 says local work no longer needs an AWS account. The line only moved, and the ticket may change it later. Possible stale text.

## Checked, no finding
- Script and docs follow the "Readable over clever" rule.
- Lint and format tools cover the code files. The script is plain.
- The unpinned `dynamodb_local_latest.tar.gz` download is the ADR's chosen approach.
- docs/structure.md is updated for the new file and folder, as the project CLAUDE.md requires.
