resource "aws_instance" "zen_app_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.main.id
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh_http.id]

  root_block_device {
    volume_type           = "gp3"
    volume_size           = 30
    delete_on_termination = true
    encrypted             = true
  }

  tags = {
    Name = "zenai"
  }
}

resource "aws_eip" "zen_app_eip" {
  instance = aws_instance.zen_app_server.id
  domain = "vpc"
}
