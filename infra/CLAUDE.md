# infra/: Terraform

A routing map for the Terraform code. Each folder below is a separate configuration with its own state, planned and applied on its own. For a one-line note on each file, read the `infra/` part of `docs/structure.md`.

| Folder | Holds | State |
| --- | --- | --- |
| `bootstrap/` | The S3 bucket for the other configurations' state | Local file, gitignored |
| `account/` | The monthly cost budget and its email alerts | S3, `account/terraform.tfstate` |
| `modules/app/` | Every AWS resource of the app, for one environment | (a module, no state) |
| `envs/dev/` | The dev environment: uses `modules/app` once and sets the tags | S3, `envs/dev/terraform.tfstate` |

## Where to find, in `modules/app/main.tf`

| Task | Resource |
| --- | --- |
| Lambda runtime, memory, timeout, env vars | `aws_lambda_function.api` |
| The zip of `api/dist/` | `data.archive_file.api` |
| Function permissions | `aws_iam_role.api` and its policy attachments |
| Routes (one per entry in `api/routes.json`) | `aws_apigatewayv2_route.api` |
| Throttling and the access log format | `aws_apigatewayv2_stage.default` |
| Log retention | `aws_cloudwatch_log_group.api`, `aws_cloudwatch_log_group.api_access` |

- `pnpm deploy:dev` (repo root) builds the API, then runs `terraform apply` in `envs/dev/`.
- A new resource's DynamoDB table goes in `modules/app/dynamodb.tf`, which the first resource creates. See `docs/adding-and-removing-resources.md`.
