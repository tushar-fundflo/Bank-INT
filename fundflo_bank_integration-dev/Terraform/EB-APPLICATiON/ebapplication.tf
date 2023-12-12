resource "aws_elastic_beanstalk_application" "eb_app" {
  name        = var.eb_application_name
  description = "${var.eb_application_name} deployment"
}