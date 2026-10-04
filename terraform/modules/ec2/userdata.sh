#!/bin/bash

set -e

export DEBIAN_FRONTEND=noninteractive

# ==============================================
# Update Ubuntu packages
# ==============================================
echo "Updating system packages..."

apt-get update -y
apt-get upgrade -y


# ==============================================
# Install required utilities
# ==============================================
echo "Installing required utilities..."

apt-get install -y \
  unzip \
  curl \
  ca-certificates \
  gnupg \
  lsb-release \
  git


# ==============================================
# Install AWS CLI v2
# ==============================================
echo "Installing AWS CLI v2..."

curl -fsSL \
  "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" \
  -o "/tmp/awscliv2.zip"

unzip -q /tmp/awscliv2.zip -d /tmp

/tmp/aws/install

rm -rf /tmp/aws /tmp/awscliv2.zip

aws --version


# ==============================================
# Install kubectl
# ==============================================
echo "Installing kubectl..."

KUBECTL_VERSION=$(curl -L -s https://dl.k8s.io/release/stable.txt)

curl -LO \
  "https://dl.k8s.io/release/$KUBECTL_VERSION/bin/linux/amd64/kubectl"

install -m 0755 kubectl /usr/local/bin/kubectl

rm -f kubectl

kubectl version --client


# ==============================================
# Install Helm
# ==============================================
echo "Installing Helm..."

curl -fsSL \
  https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

helm version


# ==============================================
# Install Docker
# ==============================================
echo "Installing Docker..."

install -m 0755 -d /etc/apt/keyrings

curl -fsSL \
  https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) \
  signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -y

apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io

systemctl enable docker
systemctl start docker

# Allow the default Ubuntu user to use Docker
usermod -aG docker ubuntu


# ==============================================
# Configure EKS kubeconfig
# ==============================================
echo "Configuring kubeconfig for EKS cluster: ${cluster_name}..."

su - ubuntu -c \
  "aws eks update-kubeconfig \
  --name ${cluster_name} \
  --region ${aws_region}" || true


# ==============================================
# Verify installed tools
# ==============================================
echo "Verifying installed tools..."

echo "AWS CLI:"
aws --version

echo "kubectl:"
kubectl version --client

echo "Helm:"
helm version

echo "Docker:"
docker --version

echo "Git:"
git --version


# ==============================================
# Setup completed
# ==============================================
echo "=============================================="
echo "Jump host setup completed successfully!"
echo "=============================================="