resource "aws_iam_role" "ec2_instance_profile" {
    name = var.eb_ec2_instance_profile_name

  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ec2.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  })
  
}
resource "aws_iam_policy_attachment" "Webtier" {
  name       = "Webtier_Policy"
  roles      = [aws_iam_role.ec2_instance_profile.name]
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}
resource "aws_iam_policy_attachment" "MulticontainerDocker" {
  name       = "MulticontainerDocker_Policy"
  roles      = [aws_iam_role.ec2_instance_profile.name]
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker"
}
resource "aws_iam_policy_attachment" "WorkerTier" {
  name       = "WorkerTier_Policy"
  roles      = [aws_iam_role.ec2_instance_profile.name]
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
}
resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = var.eb_ec2_instance_profile_name
  role = "${aws_iam_role.ec2_instance_profile.name}"
}