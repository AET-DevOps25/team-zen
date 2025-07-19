// Outputs static ip that the EC2 instance uses for CI/CD
output "ec2_public_ip" {
  value = aws_eip.zen_app_eip.public_ip
}
