variable "eks_cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "kubernetes_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.29"
}

variable "target_vpc_id" {
  description = "ID of the VPC where the EKS cluster will be deployed"
  type        = string
}

variable "public_subnet_ids" {
  description = "IDs of the public subnets associated with the EKS cluster"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "IDs of the private subnets used by the worker nodes"
  type        = list(string)
}

variable "worker_instance_type" {
  description = "EC2 instance type used by the EKS worker nodes"
  type        = string
  default     = "t3.micro"
}

variable "worker_desired_count" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "worker_min_count" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "worker_max_count" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 4
}

variable "resource_tags" {
  description = "Tags applied to EKS resources"
  type        = map(string)
  default     = {}
}