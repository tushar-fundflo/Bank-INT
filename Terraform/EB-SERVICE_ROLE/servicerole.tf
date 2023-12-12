resource "aws_iam_role" "eb_service_role" {
  name = var.eb_service_role_name
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "elasticbeanstalk.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}
resource "aws_iam_policy_attachment" "beanstalk_enhanced_health_attachment" {
  name       = "beanstalk-enhanced-health-attachment"
  roles      = [aws_iam_role.eb_service_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth"
}
resource "aws_iam_policy_attachment" "managed_updates_attachment" {
  name       = "managed-updates-attachment"
  roles      = [aws_iam_role.eb_service_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy"
}