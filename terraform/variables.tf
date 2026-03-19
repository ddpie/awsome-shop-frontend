variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "aidlc-shop"
}

variable "domain_name" {
  default = "aidlc.awsabc.cn"
}

variable "hosted_zone_id" {
  default = "Z06952451WZ8QP1O6OA7F"
}

variable "acm_certificate_arn" {
  default = "arn:aws:acm:us-east-1:022346938362:certificate/ca6368d1-7157-4c5b-b701-f002255985a2"
}

variable "vpc_id" {
  default = "vpc-3c49de46"
}

variable "subnet_ids" {
  default = ["subnet-c60b4c9a", "subnet-aed2a9c9", "subnet-df1253f1"]
}

variable "api_backend" {
  default = "https://dnkahoqj8qp6p.cloudfront.net"
}

variable "container_port" {
  default = 80
}

variable "desired_count" {
  default = 1
}
