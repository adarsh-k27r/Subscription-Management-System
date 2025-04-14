variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "subscription-tracker"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "lambda_payload_file" {
  description = "Path to the Lambda deployment package"
  type        = string
  default     = "../dist/function.zip"
} 