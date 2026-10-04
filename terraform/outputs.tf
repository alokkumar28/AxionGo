# VPC outputs.
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "CIDR block assigned to the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnet_ids
}

# EKS cluster outputs.
output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.eks_cluster_name
}

output "eks_cluster_endpoint" {
  description = "Kubernetes API endpoint of the EKS cluster"
  value       = module.eks.eks_cluster_endpoint
}

output "eks_cluster_certificate_authority" {
  description = "Base64 encoded CA certificate of the EKS cluster"
  value       = module.eks.eks_cluster_certificate_authority
  sensitive   = true
}

output "eks_cluster_security_group_id" {
  description = "Security group ID associated with the EKS control plane"
  value       = module.eks.eks_cluster_security_group_id
}

output "worker_node_role_arn" {
  description = "ARN of the IAM role assigned to EKS worker nodes"
  value       = module.eks.worker_node_role_arn
}

output "load_balancer_controller_role_arn" {
  description = "ARN of the IAM role used by the AWS Load Balancer Controller"
  value       = module.eks.load_balancer_controller_role_arn
}

output "ebs_csi_driver_role_arn" {
  description = "ARN of the IAM role used by the EBS CSI driver"
  value       = module.eks.ebs_csi_driver_role_arn
}

output "eks_oidc_provider_arn" {
  description = "ARN of the EKS OIDC identity provider"
  value       = module.eks.eks_oidc_provider_arn
}

# Jump host outputs.
output "jump_host_public_ip" {
  description = "Public IPv4 address of the jump host"
  value       = var.create_jump_host ? module.jump_host[0].jump_host_public_ip : null
}

output "jump_host_public_dns" {
  description = "Public DNS hostname of the jump host"
  value       = var.create_jump_host ? module.jump_host[0].jump_host_public_dns : null
}

output "jump_host_instance_id" {
  description = "EC2 instance ID of the jump host"
  value       = var.create_jump_host ? module.jump_host[0].jump_host_instance_id : null
}

output "jump_host_console_url" {
  description = "AWS Console URL for connecting to the jump host"
  value       = var.create_jump_host ? module.jump_host[0].jump_host_console_url : null
}

# Generate the command used to configure kubectl access.
output "kubeconfig_command" {
  description = "AWS CLI command used to configure the EKS kubeconfig"
  value       = "aws eks update-kubeconfig --name ${module.eks.eks_cluster_name} --region ${var.aws_region}"
}