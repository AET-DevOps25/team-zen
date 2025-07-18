terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.2.0"

  # Store state in S3 for persistence across workflow runs
  backend "s3" {
    bucket = "zenai-terraform-state-bucket"
    key    = "infrastructure/terraform.tfstate"
    region = "us-east-1"
  }
}
provider "aws" {
  region = var.region
}
