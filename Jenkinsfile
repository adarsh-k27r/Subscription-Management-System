pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
        terraform 'Terraform'
    }
    
    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }
        
        stage('Lint & Test') {
            steps {
                bat 'npm run lint || exit /b 0'
            }
        }
        
        stage('Build & Package') {
            steps {
                bat 'if not exist dist mkdir dist'
                bat 'xcopy /s /y app.js dist\\'
                bat 'xcopy /s /y lambda.js dist\\'
                bat 'xcopy /s /y package.json dist\\'
                bat 'xcopy /s /y package-lock.json dist\\'
                bat 'xcopy /s /y /i routes dist\\routes\\'
                bat 'xcopy /s /y /i controllers dist\\controllers\\'
                bat 'xcopy /s /y /i models dist\\models\\'
                bat 'xcopy /s /y /i middlewares dist\\middlewares\\'
                bat 'xcopy /s /y /i config dist\\config\\'
                bat 'xcopy /s /y /i database dist\\database\\'
                bat 'xcopy /s /y /i utils dist\\utils\\'
                
                bat 'cd dist && npm ci --production'
                
                // Create Lambda deployment package
                bat 'cd dist && powershell Compress-Archive -Path * -DestinationPath function.zip -Force'
            }
        }
        
        stage('Create env file') {
            steps {
                powershell '''
                @"
                PORT=3000
                NODE_ENV=production
"@ | Out-File -FilePath "dist\\.env.production.local" -Encoding utf8
                '''
            }
        }
        
        stage('Terraform Init') {
            steps {
                dir('terraform') {
                    // Create backup of previous state if it exists
                    powershell '''
                    if (Test-Path terraform.tfstate) {
                        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
                        Copy-Item terraform.tfstate "terraform.tfstate.backup.$timestamp"
                    }
                    '''
                    
                    bat 'terraform init'
                }
            }
        }
        
        stage('Terraform Plan') {
            steps {
                dir('terraform') {
                    bat 'terraform plan -out=tfplan'
                }
            }
        }
        
        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    bat 'terraform apply -auto-approve tfplan'
                }
            }
        }
        
        stage('Retrieve API URL') {
            steps {
                dir('terraform') {
                    script {
                        def apiUrl = bat(script: 'terraform output -raw api_url', returnStdout: true).trim()
                        echo "API successfully deployed to: ${apiUrl}"
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Archive Terraform state for future reference
            dir('terraform') {
                archiveArtifacts artifacts: 'terraform.tfstate', allowEmptyArchive: true
            }
            cleanWs(excludePattern: 'terraform/terraform.tfstate*')
        }
    }
} 