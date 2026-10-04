output "jump_host_instance_id" {
  description = "ID of the EC2 jump host"
  value       = aws_instance.jump_host.id
}

output "jump_host_public_ip" {
  description = "Public IPv4 address assigned to the jump host"
  value       = aws_instance.jump_host.public_ip
}

output "jump_host_public_dns" {
  description = "Public DNS hostname of the jump host"
  value       = aws_instance.jump_host.public_dns
}

output "jump_host_security_group_id" {
  description = "Security group ID associated with the jump host"
  value       = aws_security_group.jump_host.id
}

output "jump_host_iam_role_arn" {
  description = "ARN of the IAM role assigned to the jump host"
  value       = aws_iam_role.jump_host.arn
}

output "jump_host_iam_role_name" {
  description = "Name of the IAM role assigned to the jump host"
  value       = aws_iam_role.jump_host.name
}

output "jump_host_console_url" {
  description = "AWS Console URL for connecting to the jump host"
  value       = "https://console.aws.amazon.com/ec2/v2/home?#ConnectToInstance:instanceId=${aws_instance.jump_host.id}"
}