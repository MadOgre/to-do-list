# The S3 bucket that holds Terraform's state for every other folder in infra/.
# Terraform can't keep this folder's own state in a bucket that doesn't exist yet,
# so this folder keeps its state in a local file, which git ignores.

terraform {
  required_version = "~> 1.16"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.68"
    }
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      project = "to-do-list"
    }
  }
}

# Bucket names are global across all AWS accounts. The random suffix makes this one unique
# without putting the account ID in a public repo.
resource "aws_s3_bucket" "state" {
  bucket = "to-do-list-tfstate-d9a7bc3a"
}

# Versioning keeps every earlier version of each state file, so a bad write can be undone.
resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id

  versioning_configuration {
    status = "Enabled"
  }
}

output "state_bucket" {
  value = aws_s3_bucket.state.bucket
}
