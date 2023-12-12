#Provider
variable "region" {
    default = "ap-south-1" 
}

#VPC
variable "vpc_name" {
    default = "FUND-QA" 
}
variable "vpc_cidr_block" {
    type = string
    description = "Vpc Cidr Block"
    default = "192.178.0.0/20"  
}
#Subnets
variable "public_subnet_1_cidr_block" {
    type = string
    description = "Public Subnet 1 Cidr Block"
    default = "192.178.0.0/22"  
}
variable "public_subnet_2_cidr_block" {
    type = string
    description = "Public Subnet 2 Cidr Block"
    default = "192.178.4.0/22"  
}
variable "public_subnet_3_cidr_block" {
    type = string
    description = "Public Subnet 3 Cidr Block"
    default = "192.178.14.0/23"  
}
variable "private_subnet_1_cidr_block" {
    type = string
    description = "Private Subnet 1 Cidr Block"
    default = "192.178.8.0/23"  
}
variable "private_subnet_2_cidr_block" {
    type = string
    description = "Private Subnet 2 Cidr Block"
    default = "192.178.10.0/23"  
}
variable "private_subnet_3_cidr_block" {
    type = string
    description = "Private Subnet 3 Cidr Block"
    default = "192.178.12.0/23"
}
