# The app's infrastructure for one environment: the API's Lambda function, its role and logs,
# and the HTTP API in front of it. Each environment in infra/envs/ uses this module once.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.68"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.8"
    }
  }
}

locals {
  name   = "to-do-list-${var.environment}-api"
  routes = jsondecode(file("${path.module}/../../../api/routes.json"))
}

resource "aws_iam_role" "api" {
  name = "${local.name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "lambda.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_logs" {
  role       = aws_iam_role.api.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/lambda/${local.name}"
  retention_in_days = 14
}

# The bundle that `pnpm --filter @to-do-list/api build` writes, zipped for Lambda.
data "archive_file" "api" {
  type        = "zip"
  source_dir  = "${path.module}/../../../api/dist"
  output_path = "${path.module}/../../../api/dist/function.zip"
  excludes    = ["function.zip"]
}

resource "aws_lambda_function" "api" {
  function_name = local.name
  role          = aws_iam_role.api.arn

  runtime       = "nodejs26.x"
  architectures = ["arm64"]
  handler       = "index.handler"
  filename      = data.archive_file.api.output_path
  code_sha256   = data.archive_file.api.output_base64sha256

  timeout     = 10
  memory_size = 512

  environment {
    variables = {
      NODE_OPTIONS = "--enable-source-maps"
    }
  }

  logging_config {
    log_format = "JSON"
    log_group  = aws_cloudwatch_log_group.api.name
  }
}

resource "aws_apigatewayv2_api" "api" {
  name          = local.name
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "api" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.api.invoke_arn
  payload_format_version = "2.0"
}

# One route for each entry in api/routes.json. An empty routes.json makes no routes,
# and API Gateway then answers every request with its own 404.
resource "aws_apigatewayv2_route" "api" {
  for_each = { for route in local.routes : "${route.method} ${route.path}" => route }

  api_id    = aws_apigatewayv2_api.api.id
  route_key = each.key
  target    = "integrations/${aws_apigatewayv2_integration.api.id}"
}

resource "aws_cloudwatch_log_group" "api_access" {
  name              = "${local.name}-access"
  retention_in_days = 14
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_rate_limit  = 10
    throttling_burst_limit = 20
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_access.arn
    # API Gateway calls this ID the request ID. Both logs name it correlation_id,
    # the key Powertools gives it in the function's log.
    format = jsonencode({
      correlation_id     = "$context.requestId"
      route_key          = "$context.routeKey"
      path               = "$context.path"
      status             = "$context.status"
      integration_status = "$context.integrationStatus"
      function_status    = "$context.integration.status"
      integration_error  = "$context.integrationErrorMessage"
      gateway_error      = "$context.error.message"
      latency_ms         = "$context.responseLatency"
    })
  }
}

resource "aws_lambda_permission" "api" {
  statement_id  = "AllowApiGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
