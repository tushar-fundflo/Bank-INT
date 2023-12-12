pipeline{
    agent any
    parameters{
        choice(name:'AWS_ENV', choices:['QA'],description:'From which environment do you want to deploy?')
        choice(name:'AWS_REGION', choices:['ap-south-1'],description:'From which region do you want to deploy?')
        choice(name:'EB_APP_NAME', choices:['BANK_INTEGRATION'],description:'In which elasticbeanstalk application do you want to deploy?')
        choice(name:'EB_ENV_NAME', choices:['BANKINTEGRATION'],description:'In which elasticbeanstalk enviornment do you want to deploy?')
    }
    stages{
        stage('Resources Check or Create'){
            steps{
                script{
                    
                    if (params.AWS_ENV=='QA'){
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId:params.AWS_ENV]]){
                            def elasticbeanstalkVpcExists = sh(returnStdout: true, script: "aws ec2 describe-vpcs --region ${params.AWS_REGION} --filters Name=tag:Name,Values=FUND-${params.AWS_ENV}-VPC --query 'Vpcs[0].VpcId' --output text").trim()
                            def elasticbeanstalkServiceRoleExists = sh(returnStdout: true, script: "aws iam list-roles --query 'Roles[?RoleName==`FUND-${params.AWS_ENV}-EBS-ServiceRole`] | [0].RoleName' --output text").trim()
                            def elasticbeanstalkInstanceProfileExists = sh(returnStdout:true, script: "aws iam list-instance-profiles --query 'InstanceProfiles[?InstanceProfileName==`FUND-${params.AWS_ENV}-EBS-EC2InstanceProfile`] | [0].InstanceProfileName' --output text").trim()
                            def elasticbeanstalkApplicationExists = sh(returnStdout:true, script: "aws elasticbeanstalk describe-applications --region ${params.AWS_REGION} --application-names ${params.EB_APP_NAME} --query 'Applications[0].ApplicationName' --output text").trim()
                            def elasticbeanstalkEnviornment1Exists = sh (returnStdout:true, script: "aws elasticbeanstalk describe-environments --region ${params.AWS_REGION} --environment-names ${params.EB_ENV_NAME} --query 'Environments[0].EnvironmentName' --output text").trim()
                            
                            if (elasticbeanstalkVpcExists!='None') {
                                echo 'Elasticbeanstalk Vpc Exists'
                            }else{
                            echo'Elasticbeanstalk Vpc Not Exists'
                            dir ('Terraform/VPC'){
                                echo'Creating VPC'
                                sh 'terraform init'
                                sh "terraform plan -var='vpc_name=FUND-${params.AWS_ENV}'"
                                sh "terraform apply --auto-approve -var='vpc_name=FUND-${params.AWS_ENV}'"
                            }
                            }
                            if (elasticbeanstalkServiceRoleExists!='None'){
                                echo 'Elasticbeanstalk ServiceRole Exists'
                            }else{
                                echo 'Elasticbeanstalk ServiceRole Not Exists'
                                dir('Terraform/EB-SERVICE_ROLE'){
                                    echo'Creating Elasticbeanstalk ServiceRole'
                                    sh 'terraform init'
                                    sh "terraform plan -var='eb_service_role_name=FUND-${params.AWS_ENV}-EBS-ServiceRole'"
                                    sh "terraform apply --auto-approve -var='eb_service_role_name=FUND-${params.AWS_ENV}-EBS-ServiceRole'"
                                }
                            }
                            if (elasticbeanstalkInstanceProfileExists!='None') {
                                echo 'Elasticbeanstalk EC2InstanceProfile Exists'
                            }else{
                                echo 'Elasticbeanstalk EC2InstanceProfile Not Exists'
                               dir('Terraform/EB-EC2_INSTANCE_PROFILE'){
                                    echo'Creating Elasticbeanstalk EC2InstanceProfile'
                                    sh 'terraform init'
                                    sh "terraform plan -var='eb_ec2_instance_profile_name=FUND-${params.AWS_ENV}-EBS-EC2InstanceProfile'"
                                    sh "terraform apply --auto-approve -var='eb_ec2_instance_profile_name=FUND-${params.AWS_ENV}-EBS-EC2InstanceProfile'"
                                }

                            }
                            if (elasticbeanstalkApplicationExists!='None') {
                                echo 'Elasticbeanstalk Application Exists'
                            }else{
                                echo 'Elasticbeanstalk Application Not Exists'
                                dir('Terraform/EB-APPLICATiON'){
                                    echo'Creating Elasticbeanstalk Application'
                                    sh 'terraform init'
                                    sh "terraform plan -var='eb_application_name=${params.EB_APP_NAME}'"
                                    sh "terraform apply --auto-approve -var='eb_application_name=${params.EB_APP_NAME}'"
                                }
                            }
                            if (elasticbeanstalkEnviornment1Exists!='None'){
                                echo 'Elasticbeanstalk Enviornment 1 Exists'
                            }else {
                                echo 'Elasticbeanstalk Enviornment 1 Not Exists'
                                dir('Terraform/EB-ENVIRONMENT'){
                                    echo 'Creating Elasticbeanstalk Enviornment 1'
                                    def publicsubnet1 = sh(returnStdout:true, script: "aws ec2 describe-subnets --region ${params.AWS_REGION} --filters Name=vpc-id,Values=${elasticbeanstalkVpcExists} --query 'Subnets[?Tags[?Key==`Name` && Value==`FUND-${params.AWS_ENV}-PublicSubnet1a`]].SubnetId' --output text").trim()
                                    def publicsubnet2 = sh(returnStdout:true, script: "aws ec2 describe-subnets --region ${params.AWS_REGION} --filters Name=vpc-id,Values=${elasticbeanstalkVpcExists} --query 'Subnets[?Tags[?Key==`Name` && Value==`FUND-${params.AWS_ENV}-PublicSubnet2b`]].SubnetId' --output text").trim()
                            
                                    sh "terraform init"
                                    sh "terraform plan \
                                        -var='eb_application_name=${params.EB_APP_NAME}' \
                                        -var='eb_environment_name=${params.EB_ENV_NAME}' \
                                        -var='eb_environment_platform=arn:aws:elasticbeanstalk:${params.AWS_REGION}::platform/Node.js 18 running on 64bit Amazon Linux 2023/6.0.3' \
                                        -var='eb_environment_vpc_id=${elasticbeanstalkVpcExists}' \
                                        -var='eb_environment_instanceprofile_name=FUND-${params.AWS_ENV}-EBS-EC2InstanceProfile' \
                                        -var='eb_environment_subnets_id=${publicsubnet1},${publicsubnet2}' \
                                        -var='eb_environment_instance_type=t3.micro' \
                                        -var='eb_environment_autoscaling_maxcount=1'"
                                    sh "terraform apply --auto-approve \
                                        -var='eb_application_name=${params.EB_APP_NAME}' \
                                        -var='eb_environment_name=${params.EB_ENV_NAME}' \
                                        -var='eb_environment_platform=arn:aws:elasticbeanstalk:${params.AWS_REGION}::platform/Node.js 18 running on 64bit Amazon Linux 2023/6.0.3' \
                                        -var='eb_environment_vpc_id=${elasticbeanstalkVpcExists}' \
                                        -var='eb_environment_instanceprofile_name=FUND-${params.AWS_ENV}-EBS-EC2InstanceProfile' \
                                        -var='eb_environment_subnets_id=${publicsubnet1},${publicsubnet2}' \
                                        -var='eb_environment_instance_type=t3.micro' \
                                        -var='eb_environment_autoscaling_maxcount=1'"

                                }
                            }
                        }
                    }
                }    
            }
        }
        stage ('Deploy To AWS'){
            steps{
                script{
                    echo 'deploy'
                    
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId:params.AWS_ENV, region:params.AWS_REGION]]) {
                        
                        def accountNumber = sh(returnStdout: true, script: 'aws sts get-caller-identity --query "Account" --output text').trim()
                            sh "jar -cvf version-${BUILD_NUMBER}.war *"
                            sh "aws s3 cp version-${BUILD_NUMBER}.war s3://elasticbeanstalk-${params.AWS_REGION}-${accountNumber} --region ${params.AWS_REGION}"
                        
                        sh """aws elasticbeanstalk create-application-version --application-name "${params.EB_APP_NAME}" \
                        --version-label "version-${BUILD_NUMBER}" \
                        --description "Build created from JENKINS. Job:${JOB_NAME}, BuildId:${BUILD_DISPLAY_NAME}" \
                        --source-bundle S3Bucket=elasticbeanstalk-${params.AWS_REGION}-${accountNumber},S3Key=version-${BUILD_NUMBER}.war \
                        --region ${params.AWS_REGION}"""
                        sh "aws elasticbeanstalk update-environment --environment-name \"${params.EB_ENV_NAME}\" --version-label \"version-${BUILD_NUMBER}\" --region ${params.AWS_REGION}"
                    } 
                }
            }

        }
    }
}
