# Settings for the whole AWS account, not for one environment: the monthly cost budget and its alerts.

terraform {
  required_version = "~> 1.16"

  backend "s3" {
    bucket       = "to-do-list-tfstate-d9a7bc3a"
    key          = "account/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
    encrypt      = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.68"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Who Terraform runs as, read at run time, so no account ID is written in this file.
data "aws_caller_identity" "current" {}

output "caller_arn" {
  value = data.aws_caller_identity.current.arn
}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}

variable "alert_email" {
  type        = string
  description = "The email address that AWS Budgets sends cost alerts to"
}

resource "aws_budgets_budget" "monthly" {
  name         = "monthly-cost"
  budget_type  = "COST"
  limit_amount = "10"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    notification_type          = "ACTUAL"
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    notification_type          = "ACTUAL"
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    subscriber_email_addresses = [var.alert_email]
  }
}
