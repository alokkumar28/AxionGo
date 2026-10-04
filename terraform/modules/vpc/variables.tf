variable "network_name" {
  description = "Name prefix used for VPC and networking resources"
  type        = string
}

variable "vpc_cidr_block" {
  description = "CIDR block assigned to the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "eks_cluster_name" {
  description = "Name of the EKS cluster used for subnet tagging"
  type        = string
}

variable "resource_tags" {
  description = "Common tags applied to networking resources"
  type        = map(string)
  default     = {}
}