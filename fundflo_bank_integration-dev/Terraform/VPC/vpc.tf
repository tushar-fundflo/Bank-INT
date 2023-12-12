#AWS_CRED
provider "aws" {
    region = var.region
}

#VPC
resource "aws_vpc" "new_vpc" {
  cidr_block       = var.vpc_cidr_block
  instance_tenancy = "default"
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.vpc_name}-VPC"
  }
}
# Create Public Subnets
resource "aws_subnet" "public_subnet_1" {
  vpc_id            = aws_vpc.new_vpc.id
  cidr_block        = var.public_subnet_1_cidr_block
  availability_zone = "${var.region}a"

  tags = {
    Name = "${var.vpc_name}-PublicSubnet1a"
  }
}
resource "aws_subnet" "public_subnet_2" {
  vpc_id            = aws_vpc.new_vpc.id
  cidr_block        = var.public_subnet_2_cidr_block
  availability_zone = "${var.region}b"

  tags = {
    Name = "${var.vpc_name}-PublicSubnet2b"
  }
}
resource "aws_subnet" "public_subnet_3" {
  vpc_id            = aws_vpc.new_vpc.id
  cidr_block        = var.public_subnet_3_cidr_block
  availability_zone = "${var.region}c"

  tags = {
    Name = "${var.vpc_name}-PublicSubnet3c"
  }
}
# Create Private Subnets
resource "aws_subnet" "private_subnet_1" {
  vpc_id            = aws_vpc.new_vpc.id
  cidr_block        = var.private_subnet_1_cidr_block
  availability_zone = "${var.region}a"

  tags = {
    Name = "${var.vpc_name}-PrivateSubnet1a"
  }
}
resource "aws_subnet" "private_subnet_2" {
  vpc_id            = aws_vpc.new_vpc.id
  cidr_block        = var.private_subnet_2_cidr_block
  availability_zone = "${var.region}b"

  tags = {
    Name = "${var.vpc_name}-PrivateSubnet2b"
  }
}
resource "aws_subnet" "private_subnet_3" {
  vpc_id            = aws_vpc.new_vpc.id
  cidr_block        = var.private_subnet_3_cidr_block
  availability_zone = "${var.region}c"

  tags = {
    Name = "${var.vpc_name}-PrivateSubnet3c"
  }
}
# Create a Internet Gateway
resource "aws_internet_gateway" "new_igw" {
  vpc_id            = aws_vpc.new_vpc.id

  tags = {
    Name = "${var.vpc_name}-InternetGateway"
  }
}
# Create a public route table
resource "aws_route_table" "public_route_table" {
  vpc_id            = aws_vpc.new_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.new_igw.id
  }
  route {
    cidr_block = var.vpc_cidr_block
    gateway_id = "local"
  }

  tags = {
    Name = "${var.vpc_name}-PublicRouteTable"
  }
}
resource "aws_route_table_association" "public_subnet_1_association" {
  subnet_id = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_route_table.id
}
resource "aws_route_table_association" "public_subnet_2_association" {
  subnet_id = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_route_table.id
}
resource "aws_route_table_association" "public_subnet_3_association" {
  subnet_id = aws_subnet.public_subnet_3.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_nat_gateway" "new_nat_gateway" {
  allocation_id = aws_eip.nat_gateway_eip.id
  subnet_id = aws_subnet.public_subnet_1.id
  tags = {
    Name = "${var.vpc_name}-NatGateway"
  }
}

resource "aws_eip" "nat_gateway_eip" {
  tags = {
    Name = "${var.vpc_name}-NatGatewayEIP"
  }
}
# Create a private route table
resource "aws_route_table" "private_route_table" {
  vpc_id            = aws_vpc.new_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.new_nat_gateway.id
  }
  route {
    cidr_block = var.vpc_cidr_block
    gateway_id = "local"
  }

  tags = {
    Name = "${var.vpc_name}-PrivateRouteTable"
  }
}
resource "aws_route_table_association" "private_subnet_1_association" {
  subnet_id = aws_subnet.private_subnet_1.id
  route_table_id = aws_route_table.private_route_table.id
}
resource "aws_route_table_association" "private_subnet_2_association" {
  subnet_id = aws_subnet.private_subnet_2.id
  route_table_id = aws_route_table.private_route_table.id
}
resource "aws_route_table_association" "private_subnet_3_association" {
  subnet_id = aws_subnet.private_subnet_3.id
  route_table_id = aws_route_table.private_route_table.id
}