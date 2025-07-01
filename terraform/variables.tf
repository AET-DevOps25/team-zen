variable "ami_id" {
  description = "The AMI ID to use for the instance."
  type        = string
  default     = "ami-084568db4383264d4" // AMI ID for Ubuntu 20.04 in us-east-1
}

variable "instance_type" {
  description = "The EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
  default     = "vockey" // Key pair name setup from AWS Academy Lab
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}
