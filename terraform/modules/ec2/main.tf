# Latest Ubuntu 22.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}

# IAM Role for Jump Host
resource "aws_iam_role" "jump_host" {
  name = "${var.server_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      # Trust relationship for EC2 service to assume this role
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })

  tags = var.resource_tags
}

# EKS permissions
resource "aws_iam_role_policy_attachment" "eks_access" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.jump_host.name
}

# ECR read-only permissions
resource "aws_iam_role_policy_attachment" "ecr_access" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.jump_host.name
}

# Custom EKS and ECR permissions
resource "aws_iam_role_policy" "cluster_access" {
  name = "${var.server_name}-eks-access"
  role = aws_iam_role.jump_host.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "eks:DescribeCluster",
          "eks:ListClusters",
          "eks:ListNodegroups",
          "eks:DescribeNodegroup",
          "eks:AccessKubernetesApi"
        ]

        Resource = "*"
      },
      {
        Effect = "Allow"

        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]

        Resource = "*"
      }
    ]
  })
}

# Instance Profile
resource "aws_iam_instance_profile" "jump_host" {
  name = "${var.server_name}-profile"
  role = aws_iam_role.jump_host.name

  tags = var.resource_tags
}

# Security Group
resource "aws_security_group" "jump_host" {
  name_prefix = "${var.server_name}-"
  description = "Security group for the jump host"
  vpc_id      = var.target_vpc_id

  ingress {
    description = "Allow SSH connections"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.ssh_allowed_cidrs
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.resource_tags, {
    Name = "${var.server_name}-sg"
  })
}

# EC2 Jump Host
resource "aws_instance" "jump_host" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.ec2_instance_type
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [aws_security_group.jump_host.id]
  iam_instance_profile   = aws_iam_instance_profile.jump_host.name

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
    encrypted   = true
  }

  user_data = base64encode(templatefile("${path.module}/userdata.sh", {
    cluster_name = var.eks_cluster_name
    aws_region   = var.region
  }))

  tags = merge(var.resource_tags, {
    Name = var.server_name
  })
}