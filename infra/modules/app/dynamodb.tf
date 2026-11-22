resource "aws_dynamodb_table" "todos" {
  name         = "${local.prefix}-todos"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "owner_id"
  range_key    = "todo_id"

  attribute {
    name = "owner_id"
    type = "S"
  }

  attribute {
    name = "todo_id"
    type = "S"
  }
}
