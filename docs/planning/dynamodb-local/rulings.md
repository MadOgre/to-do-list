# Rulings

- 02: DynamoDB Local listens on `localhost` only, if DynamoDB Local has an option for that. If DynamoDB Local has no such option, `docs/local-development.md` says that other machines on the network can reach DynamoDB Local on port 8000. Overrides: nothing.
- 02: On WSL 1, DynamoDB Local can start on a taken port 8000 and print no error. The "Port taken" scenario expects DynamoDB Local's error except on WSL 1. `docs/local-development.md` says so in one sentence. Overrides: the spec's "Port taken" scenario, and the sentence "if one is taken, its server stops with an error" in `docs/local-development.md`.
- 02: `bin/setup-local-db.sh` prints one line for each step that it runs, `Installing Java...` and `Downloading DynamoDB Local...`, then `DynamoDB Local is installed in api/.dynamodb-local/.` after an install. Overrides: the spec's "Fresh machine" and "Java already there" scenarios, which named no messages.
- 02: Git ignores `api/dynamodb-local-metadata.json`, which DynamoDB Local writes into the folder where it runs. Overrides: nothing.
- 02: DynamoDB Local starts with `-disableTelemetry`, in `dev:db` and in the reset's start. Overrides: the start values in ticket 02 and ticket 05, which named port 8000, `-sharedDb` and the data folder only.
