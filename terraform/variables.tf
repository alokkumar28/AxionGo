# General project configuration.
variable "aws_region" {
  description = "AWS region where the infrastructure will be deployed"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name used as the naming prefix for infrastructure"
  type        = string
  default     = "axion-go"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "production"
}

# VPC configuration.
variable "vpc_cidr_block" {
  description = "CIDR block assigned to the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# EKS cluster configuration.
variable "eks_cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "axion-go-cluster"
}

variable "kubernetes_version" {
  description = "Kubernetes version used by the EKS cluster"
  type        = string
  default     = "1.29"
}

variable "worker_instance_type" {
  description = "EC2 instance type used by EKS worker nodes"
  type        = string
  default     = "t3.micro"
}

variable "worker_desired_count" {
  description = "Desired number of EKS worker nodes"
  type        = number
  default     = 2
}

variable "worker_min_count" {
  description = "Minimum number of EKS worker nodes"
  type        = number
  default     = 1
}

variable "worker_max_count" {
  description = "Maximum number of EKS worker nodes"
  type        = number
  default     = 4
}

# Jump host configuration.
variable "create_jump_host" {
  description = "Whether to create the EC2 jump host"
  type        = bool
  default     = true
}

variable "jump_host_instance_type" {
  description = "EC2 instance type used by the jump host"
  type        = string
  default     = "t3.micro"
}

variable "jump_host_volume_size" {
  description = "Root EBS volume size of the jump host in GB"
  type        = number
  default     = 8
}

variable "jump_host_allowed_ssh_cidrs" {
  description = "CIDR ranges allowed to connect to the jump host through SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}