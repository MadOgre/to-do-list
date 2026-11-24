# infra/: Terraform

A routing map for the Terraform code. Each folder below is a separate configuration with its own state, planned and applied on its own. For a one-line note on each file, read the `infra/` part of `docs/structure.md`.

| Folder | Holds | State |
| --- | --- | --- |
| `bootstrap/` | The S3 bucket for the other configurations' state | Local file, gitignored |
| `account/` | The monthly cost budget and its email alerts | S3, `account/terraform.tfstate` |
| `modules/app/` | Every AWS resource of the app, for one environment | (a module, no state) |
| `envs/dev/` | The dev environment: uses `modules/app` once and sets the tags | S3, `envs/dev/terraform.tfstate` |

## Where to find, in `modules/app/`

| Task | Resource |
| --- | --- |
| Lambda runtime, memory, timeout, env vars | `aws_lambda_function.api` in `main.tf` |
| The zip of `api/dist/` | `data.archive_file.api` in `main.tf` |
| Function permissions | `aws_iam_role.api` and its policy attachments in `main.tf` |
| The todos table's access | `aws_iam_role_policy.api_todos_table` in `main.tf` |
| The todos table: its name and keys | `aws_dynamodb_table.todos` in `dynamodb.tf` |
| Routes (one per entry in `api/routes.json`) | `aws_apigatewayv2_route.api` in `main.tf` |
| Throttling and the access log format | `aws_apigatewayv2_stage.default` in `main.tf` |
| Log retention | `aws_cloudwatch_log_group.api`, `aws_cloudwatch_log_group.api_access` in `main.tf` |

- `pnpm deploy:dev` (repo root) builds the API, then runs `terraform apply` in `envs/dev/`.
- `modules/app/dynamodb.tf` holds one DynamoDB table per resource. A new resource adds its table there. See `docs/adding-and-removing-resources.md`.
