pipeline {
    agent any
    tools {
        nodejs 'node'
        dockerTool 'docker-i'
    }
    environment {
        SONAR_SCANNER = tool 'sonar-scanner'
    }
    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/venkaiahkuncham123-tech/ssms-redbus-fullapp.git'
            }
        }
        stage('git leaks detect') {
            steps {
                sh 'gitleaks detect --source . --report-format table --report-path gitleaks-report.txt'
            }
        }
        stage('Dependency Scan') {
            steps {
                sh 'trivy fs --format table --output trivy-fs-report.txt .'
            }
        }
  
        stage('Sonarqube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                sh '''${SONAR_SCANNER}/bin/sonar-scanner -Dsonar.projectName=NodeJs -Dsonar.projectKey=Nodejs'''
        }
            }
        }
        stage('Docker Build') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker-token') {
    sh 'docker build -t ghcr.io/venkaiahkuncham123/redbus:v1 -f Dockerfile.prod .'
                                }
                            
                        }
                
            }
        }
        stage('Trviy Image Scan') {
            steps {
                
                    sh 'trivy image --format table --output image.txt ghcr.io/venkaiahkuncham123/redbus:v1'
                        
                }
            }
        stage('Docker Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'git-token' , url:'https://ghcr.io/v1/') {
                            sh 'docker push ghcr.io/venkaiahkuncham123/redbus:v1'
                        }
                }
            }
        }
        stage('K8S Deployment') {
            steps {
                script {
                    withKubeConfig(caCertificate: '', clusterName: 'kubernetes', contextName: '', credentialsId: 'K8S-SA-Token', namespace: 'redbus', restrictKubeConfigAccess: false, serverUrl:'https://172.31.26.159:6443') {
     sh 'kubectl create -f k8s.yaml'
                        }
                }
               
            }
        }
    }
}
