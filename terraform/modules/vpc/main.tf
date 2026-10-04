# Discover available AWS Availability Zones.
data "aws_availability_zones" "available" {
  state = "available"
}

# Select the first two available Availability Zones.
locals {
  availability_zones = slice(
    data.aws_availability_zones.available.names,
    0,
    2
  )
}

# Create the VPC for the AWS infrastructure.
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.resource_tags, {
    Name = "${var.network_name}-vpc"
  })
}

# Create public subnets for internet-facing resources.
resource "aws_subnet" "public" {
  count = length(local.availability_zones)

  vpc_id = aws_vpc.main.id

  cidr_block = cidrsubnet(
    var.vpc_cidr_block,
    8,
    count.index
  )

  availability_zone       = local.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = merge(var.resource_tags, {
    Name = "${var.network_name}-public-${local.availability_zones[count.index]}"

    "kubernetes.io/role/elb" = "1"

    "kubernetes.io/cluster/${var.eks_cluster_name}" = "shared"
  })
}

# Create private subnets for worker nodes and internal resources.
resource "aws_subnet" "private" {
  count = length(local.availability_zones)

  vpc_id = aws_vpc.main.id

  cidr_block = cidrsubnet(
    var.vpc_cidr_block,
    8,
    count.index + 10
  )

  availability_zone = local.availability_zones[count.index]

  tags = merge(var.resource_tags, {
    Name = "${var.network_name}-private-${local.availability_zones[count.index]}"

    "kubernetes.io/role/internal-elb" = "1"

    "kubernetes.io/cluster/${var.eks_cluster_name}" = "shared"
  })
}

# Create an Internet Gateway for public internet connectivity.
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(var.resource_tags, {
    Name = "${var.network_name}-igw"
  })
}

# Allocate a public Elastic IP for the NAT Gateway.
resource "aws_eip" "nat_gateway" {
  domain = "vpc"

  tags = merge(var.resource_tags, {
    Name = "${var.network_name}-nat-eip"
  })
}

# Create a NAT Gateway for outbound private subnet traffic.
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat_gateway.id
  subnet_id     = aws_subnet.public[0].id

  tags = merge(var.resource_tags, {
    Name = "${var.network_name}-nat"
  })

  depends_on = [
    aws_internet_gateway.main
  ]
}

# Create the route table used by public subnets.
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(var.resource_tags, {
    Name = "${var.network_name}-public-rt"
  })
}

# Create the route table used by private subnets.
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = merge(var.resource_tags, {
    Name = "${var.network_name}-private-rt"
  })
}

# Associate each public subnet with the public route table.
resource "aws_route_table_association" "public" {
  count = length(local.availability_zones)

  subnet_id = aws_subnet.public[count.index].id

  route_table_id = aws_route_table.public.id
}

# Associate each private subnet with the private route table.
resource "aws_route_table_association" "private" {
  count = length(local.availability_zones)

  subnet_id = aws_subnet.private[count.index].id

  route_table_id = aws_route_table.private.id
}