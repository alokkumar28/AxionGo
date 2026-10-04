# Create the IAM role used by the EKS control plane.
resource "aws_iam_role" "eks_cluster" {
  name = "${var.eks_cluster_name}-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      # Trust relationship for EKS service to assume this role
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })

  tags = var.resource_tags
}

# Grant the EKS control plane permission to manage AWS resources.
resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster.name
}

# Grant EKS permissions for VPC resource management.
resource "aws_iam_role_policy_attachment" "eks_vpc_controller" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.eks_cluster.name
}

# Create the security group for the EKS control plane.
resource "aws_security_group" "eks_cluster" {
  name_prefix = "${var.eks_cluster_name}-cluster-"
  description = "Security group for the EKS control plane"
  vpc_id      = var.target_vpc_id

  ingress {
    description = "Allow HTTPS access to the Kubernetes API"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.resource_tags, {
    Name = "${var.eks_cluster_name}-cluster-sg"
  })
}

# Create the EKS Kubernetes control plane.
resource "aws_eks_cluster" "eks" {
  name     = var.eks_cluster_name
  version  = var.kubernetes_version
  role_arn = aws_iam_role.eks_cluster.arn

  vpc_config {
    subnet_ids = concat(
      var.public_subnet_ids,
      var.private_subnet_ids
    )

    security_group_ids = [
      aws_security_group.eks_cluster.id
    ]

    endpoint_public_access  = true
    endpoint_private_access = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_controller,
  ]

  tags = merge(var.resource_tags, {
    Name = var.eks_cluster_name
  })
}

# Create the IAM role used by the EKS worker nodes.
resource "aws_iam_role" "worker_nodes" {
  name = "${var.eks_cluster_name}-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"

      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })

  tags = var.resource_tags
}

# Allow worker nodes to communicate with the EKS control plane.
resource "aws_iam_role_policy_attachment" "worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.worker_nodes.name
}

# Allow worker nodes to use the Amazon VPC CNI plugin.
resource "aws_iam_role_policy_attachment" "worker_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.worker_nodes.name
}

# Allow worker nodes to pull container images from ECR.
resource "aws_iam_role_policy_attachment" "worker_ecr_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.worker_nodes.name
}

# Create the managed EKS worker node group.
resource "aws_eks_node_group" "workers" {
  cluster_name    = aws_eks_cluster.eks.name
  node_group_name = "${var.eks_cluster_name}-nodes"
  node_role_arn   = aws_iam_role.worker_nodes.arn

  subnet_ids = var.private_subnet_ids

  ami_type       = "AL2023_x86_64_STANDARD"
  instance_types = [var.worker_instance_type]

  scaling_config {
    desired_size = var.worker_desired_count
    min_size     = var.worker_min_count
    max_size     = var.worker_max_count
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.worker_node_policy,
    aws_iam_role_policy_attachment.worker_cni_policy,
    aws_iam_role_policy_attachment.worker_ecr_policy,
  ]

  tags = merge(var.resource_tags, {
    Name = "${var.eks_cluster_name}-nodes"
  })
}

# Retrieve the EKS OIDC certificate for IRSA configuration.
data "tls_certificate" "eks_oidc" {
  url = aws_eks_cluster.eks.identity[0].oidc[0].issuer
}

# Create the OIDC provider used by Kubernetes service accounts.
resource "aws_iam_openid_connect_provider" "eks_oidc" {
  client_id_list = [
    "sts.amazonaws.com"
  ]

  thumbprint_list = [
    data.tls_certificate.eks_oidc.certificates[0].sha1_fingerprint
  ]

  url = aws_eks_cluster.eks.identity[0].oidc[0].issuer

  tags = var.resource_tags
}

# Create the IAM role used by the AWS Load Balancer Controller.
resource "aws_iam_role" "load_balancer_controller" {
  name = "${var.eks_cluster_name}-alb-controller"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Principal = {
        Federated = aws_iam_openid_connect_provider.eks_oidc.arn
      }

      Action = "sts:AssumeRoleWithWebIdentity"

      Condition = {
        StringEquals = {
          "${replace(
            aws_eks_cluster.eks.identity[0].oidc[0].issuer,
            "https://",
            ""
          )}:sub" = "system:serviceaccount:kube-system:aws-load-balancer-controller"

          "${replace(
            aws_eks_cluster.eks.identity[0].oidc[0].issuer,
            "https://",
            ""
          )}:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })

  tags = var.resource_tags
}

# Grant the Load Balancer Controller permission to manage Elastic Load Balancers.
resource "aws_iam_role_policy_attachment" "load_balancer_controller" {
  policy_arn = "arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess"
  role       = aws_iam_role.load_balancer_controller.name
}

# Create the IAM role used by the EBS CSI driver.
resource "aws_iam_role" "ebs_csi_driver" {
  name = "${var.eks_cluster_name}-ebs-csi-driver"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Principal = {
        Federated = aws_iam_openid_connect_provider.eks_oidc.arn
      }

      Action = "sts:AssumeRoleWithWebIdentity"

      Condition = {
        StringEquals = {
          "${replace(
            aws_eks_cluster.eks.identity[0].oidc[0].issuer,
            "https://",
            ""
          )}:sub" = "system:serviceaccount:kube-system:ebs-csi-controller-sa"

          "${replace(
            aws_eks_cluster.eks.identity[0].oidc[0].issuer,
            "https://",
            ""
          )}:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })

  tags = var.resource_tags
}

# Grant the EBS CSI driver permission to manage EBS volumes.
resource "aws_iam_role_policy_attachment" "ebs_csi_driver" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
  role       = aws_iam_role.ebs_csi_driver.name
}

# Install the AWS EBS CSI driver as an EKS managed add-on.
resource "aws_eks_addon" "ebs_csi_driver" {
  cluster_name = aws_eks_cluster.eks.name
  addon_name   = "aws-ebs-csi-driver"

  service_account_role_arn = aws_iam_role.ebs_csi_driver.arn

  depends_on = [
    aws_eks_node_group.workers
  ]

  tags = var.resource_tags
}
