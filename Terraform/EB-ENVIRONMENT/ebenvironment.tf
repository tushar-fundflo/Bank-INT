resource "aws_elastic_beanstalk_environment" "eb_env" {
  name          = var.eb_environment_name
  application   = var.eb_application_name
  platform_arn  = var.eb_environment_platform
  cname_prefix  = var.eb_environment_name

  setting {
    namespace = "aws:ec2:vpc"
    name = "VPCId"
    value = var.eb_environment_vpc_id
  }
   setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "false"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = var.eb_environment_instanceprofile_name
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = var.eb_environment_subnets_id
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = var.eb_environment_instance_type
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = var.eb_environment_autoscaling_maxcount
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBScheme"
    value     = "internet facing"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "MatcherHTTPCode"
    value     = 200
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "HealthCheckPath"
    value     = "/"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "NODE_ENV"
    value     = var.NODE_ENV
  }
}
