# The dev environment: the app's module, deployed with the name dev.
# Deploy it from the repo's root with `pnpm deploy:dev`.

terraform {
  required_version = "~> 1.16"

  backend "s3" {
    bucket       = "to-do-list-tfstate-d9a7bc3a"
    key          = "envs/dev/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
    encrypt      = true
  }

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

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      project     = "to-do-list"
      environment = "dev"
    }
  }
}

module "app" {
  source = "../../modules/app"

  environment = "dev"
}

output "api_url" {
  value = module.app.api_url
}
