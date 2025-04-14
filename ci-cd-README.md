# CI/CD Setup for Subscription Tracker Application

This repository contains the necessary configuration for deploying the Subscription Tracker application to AWS Lambda using Jenkins and Terraform.

## Architecture

- **Application**: Node.js Express application with MongoDB and Redis
- **Deployment Target**: AWS Lambda with API Gateway
- **CI/CD Pipeline**: Jenkins
- **Infrastructure as Code**: Terraform (with local state management)
- **Cost Optimization**: Configured to minimize AWS costs

## Prerequisites

1. AWS Account with configured AWS CLI
2. Jenkins server with the following plugins installed:
   - NodeJS Plugin
   - Terraform Plugin
   - AWS Credentials Plugin
   - Pipeline Plugin
3. Terraform CLI
4. AWS CLI

## Cost-Saving Measures

The deployment is configured to minimize AWS costs:
- Lambda memory is set to minimum required (128MB)
- Lambda timeout is optimized (10 seconds)
- Using local Terraform state instead of S3/DynamoDB
- API Gateway configured as regional (not multi-region)

## Setup Instructions

### 1. Run the Setup Script

The provided setup script will:
- Create necessary directories
- Verify AWS CLI and Terraform installations

```cmd
setup-ci-cd.bat
```

### 2. Install Required Jenkins Plugins

Ensure the following plugins are installed in your Jenkins:
- NodeJS Plugin
- Terraform Plugin
- AWS Credentials Plugin
- Pipeline Plugin

You can install them from Jenkins Dashboard → Manage Jenkins → Plugins → Available plugins.

### 3. Configure Jenkins Tools

In Jenkins Global Tool Configuration (Manage Jenkins → Tools):
1. Add NodeJS installation (name it 'NodeJS')
2. Add Terraform installation (name it 'Terraform')

### 4. Configure Jenkins Credentials

Add the following credentials to Jenkins (Manage Jenkins → Credentials → System → Global credentials):
- AWS Access Key ID (`aws-access-key-id`)
- AWS Secret Access Key (`aws-secret-access-key`)

### 5. Create Jenkins Pipeline

Create a new pipeline job in Jenkins:
1. Select "Pipeline" as the job type
2. In the pipeline configuration, select "Pipeline script from SCM"
3. Set SCM to Git and provide your repository URL
4. Set the script path to "Jenkinsfile"

### 6. Run the Pipeline

Once configured, the pipeline will:
1. Check out the code
2. Install dependencies
3. Run linting
4. Build and package the application for Lambda
5. Initialize and apply Terraform configuration
6. Deploy the application to AWS Lambda and API Gateway

## Pipeline Stages

1. **Checkout**: Fetches the latest code from the repository
2. **Install Dependencies**: Installs Node.js dependencies
3. **Lint & Test**: Runs linting and tests
4. **Build & Package**: Creates a Lambda deployment package
5. **Create env file**: Generates the environment configuration
6. **Terraform Init**: Initializes Terraform
7. **Terraform Plan**: Creates a Terraform execution plan
8. **Terraform Apply**: Applies the Terraform changes
9. **Retrieve API URL**: Gets the deployed API URL from Terraform output

## Managing Terraform State

The Terraform state is stored locally in the Jenkins workspace. For team environments, consider:
1. Committing the state file to your repository for shared access (not recommended for sensitive data)
2. Setting up a shared network drive for the Terraform state
3. For production environments, eventually migrating to remote state with proper access controls

## Maintenance

- **Update Application**: Push changes to the repository to trigger a new deployment
- **Infrastructure Changes**: Modify the Terraform configuration files and commit to apply changes
- **Pipeline Modifications**: Update the Jenkinsfile to change the CI/CD pipeline behavior 