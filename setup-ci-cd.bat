@echo off
echo === Setting up CI/CD pipeline for Subscription Tracker ===

:: Create necessary directories
mkdir terraform 2>nul
mkdir dist 2>nul

:: Check AWS CLI configuration
echo === Checking AWS CLI configuration ===
aws sts get-caller-identity > nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo AWS CLI is not configured. Please configure it with 'aws configure' before proceeding.
  exit /b 1
) else (
  echo AWS CLI is configured correctly.
)

:: Check Terraform installation
echo === Checking Terraform installation ===
terraform --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Terraform is not installed or not in PATH. Please install Terraform before proceeding.
  exit /b 1
) else (
  echo Terraform is installed correctly.
)

echo === Setup complete! ===
echo === Next steps:
echo 1. Copy the Jenkinsfile to your repository root
echo 2. Configure Jenkins pipeline (see ci-cd-README.md for instructions)
echo 3. Make sure the following plugins are installed in Jenkins:
echo    - NodeJS Plugin
echo    - Terraform Plugin
echo    - AWS Credentials Plugin
echo    - Pipeline Plugin
echo 4. Configure Jenkins credentials:
echo    - AWS access key and secret (aws-access-key-id, aws-secret-access-key)
echo 5. Create a new pipeline job in Jenkins pointing to your repository
echo 6. Trigger the pipeline to deploy your application to AWS Lambda 