output "api_url" {
  description = "The HTTP API's base URL"
  value       = aws_apigatewayv2_api.api.api_endpoint
}
