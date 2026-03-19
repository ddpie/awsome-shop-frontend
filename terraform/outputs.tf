output "ecr_repository_url" {
  value = aws_ecr_repository.frontend.repository_url
}

output "alb_dns_name" {
  value = aws_lb.frontend.dns_name
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "site_url" {
  value = "https://${var.domain_name}"
}
