terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.68" 
    }
  }

  required_version = ">= 1.0" 
}
