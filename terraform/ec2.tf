resource "aws_instance" "zen_app_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.main.id
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh_http.id]

  tags = {
    Name = "zenai"
  }
}

// Allocate an Elastic IP and associate it with the EC2 instance so that it has a static public IP address
resource "aws_eip" "zen_app_eip" {
  instance = aws_instance.zen_app_server.id
}
