# Define common tags shared across all infrastructure resources.
locals {
  common_tags = {
    Project     = var.project_name
    ManagedBy   = "terraform"
    Environment = var.environment
  }
}

# Create the VPC and networking infrastructure.
module "vpc" {
  source = "./modules/vpc"

  network_name     = var.project_name
  vpc_cidr_block   = var.vpc_cidr_block
  eks_cluster_name = var.eks_cluster_name
  resource_tags    = local.common_tags
}

# Create the EKS cluster and worker infrastructure.
module "eks" {
  source = "./modules/eks"

  eks_cluster_name    = var.eks_cluster_name
  kubernetes_version  = var.kubernetes_version
  target_vpc_id       = module.vpc.vpc_id
  public_subnet_ids   = module.vpc.public_subnet_ids
  private_subnet_ids  = module.vpc.private_subnet_ids
  worker_instance_type = var.worker_instance_type
  worker_desired_count = var.worker_desired_count
  worker_min_count     = var.worker_min_count
  worker_max_count     = var.worker_max_count
  resource_tags        = local.common_tags
}

# Optionally create the EC2 jump host for cluster administration.
module "jump_host" {
  source = "./modules/ec2"
  count  = var.create_jump_host ? 1 : 0

  server_name       = "${var.project_name}-jump-host"
  target_vpc_id     = module.vpc.vpc_id
  public_subnet_id  = module.vpc.public_subnet_ids[0]
  ec2_instance_type = var.jump_host_instance_type
  root_volume_size  = var.jump_host_volume_size
  ssh_allowed_cidrs = var.jump_host_allowed_ssh_cidrs
  eks_cluster_name  = var.eks_cluster_name
  region            = var.aws_region
  resource_tags     = local.common_tags
}