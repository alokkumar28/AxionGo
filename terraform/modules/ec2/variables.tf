variable "server_name" {
  description = "Name assigned to the jump host and its related resources"
  type        = string
}

variable "target_vpc_id" {
  description = "ID of the VPC in which the jump host will be deployed"
  type        = string
}

variable "public_subnet_id" {
  description = "ID of the public subnet used for the jump host"
  type        = string
}

variable "ec2_instance_type" {
  description = "EC2 instance type for the jump host"
  type        = string
  default     = "t3.micro"
}

variable "root_volume_size" {
  description = "Size of the root EBS volume in GB"
  type        = number
  default     = 8
}

variable "ssh_allowed_cidrs" {
  description = "CIDR ranges permitted to establish SSH connections"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "eks_cluster_name" {
  description = "Name of the EKS cluster used to configure kubeconfig on the jump host"
  type        = string
}

variable "region" {
  description = "AWS region where the jump host will be provisioned"
  type        = string
  default = "ap-south-1"
}

variable "resource_tags" {
  description = "Tags applied to the jump host and associated resources"
  type        = map(string)
  default     = {}
}