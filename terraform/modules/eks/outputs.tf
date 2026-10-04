output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = aws_eks_cluster.eks.name
}

output "eks_cluster_endpoint" {
  description = "Kubernetes API endpoint of the EKS cluster"
  value       = aws_eks_cluster.eks.endpoint
}

output "eks_cluster_certificate_authority" {
  description = "Base64 encoded CA certificate of the EKS cluster"
  value       = aws_eks_cluster.eks.certificate_authority[0].data
  sensitive   = true
}

output "eks_cluster_security_group_id" {
  description = "Security group ID attached to the EKS control plane"
  value       = aws_security_group.eks_cluster.id
}

output "worker_node_role_arn" {
  description = "ARN of the IAM role assigned to EKS worker nodes"
  value       = aws_iam_role.worker_nodes.arn
}

output "eks_node_security_group_id" {
  description = "Cluster security group ID used by the EKS node infrastructure"
  value       = aws_eks_cluster.eks.vpc_config[0].cluster_security_group_id
}

output "load_balancer_controller_role_arn" {
  description = "ARN of the IAM role used by the AWS Load Balancer Controller"
  value       = aws_iam_role.load_balancer_controller.arn
}

output "ebs_csi_driver_role_arn" {
  description = "ARN of the IAM role used by the EBS CSI driver"
  value       = aws_iam_role.ebs_csi_driver.arn
}

output "eks_oidc_provider_arn" {
  description = "ARN of the EKS OIDC identity provider"
  value       = aws_iam_openid_connect_provider.eks_oidc.arn
}

output "eks_oidc_provider_url" {
  description = "URL of the EKS OIDC identity provider"
  value       = aws_eks_cluster.eks.identity[0].oidc[0].issuer
}