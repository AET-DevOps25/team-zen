terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.2.0"
}
provider "aws" {
  region = var.region
  access_key = environment("AWS_ACCESS_KEY_ID")
  secret_key = environment("AWS_SECRET_ACCESS_KEY")
}
