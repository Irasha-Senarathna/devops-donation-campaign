pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'irashasenarathna'
        DOCKERHUB_PASSWORD = credentials('docker-hub') // Docker Hub token stored in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/Irasha-Senarathna/devops-donation-campaign.git',
                    credentialsId: 'github-pat'  // GitHub PAT credential stored in Jenkins
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/donation-frontend:latest ./frontend'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/donation-backend:latest ./backend'
            }
        }

        stage('Push Frontend & Backend to Docker Hub') {
            steps {
                // Login to Docker Hub
                sh 'echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USER --password-stdin'
                
                // Push images
                sh 'docker push $DOCKERHUB_USER/donation-frontend:latest'
                sh 'docker push $DOCKERHUB_USER/donation-backend:latest'
                
                // Logout (optional)
                sh 'docker logout'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully and Docker images are pushed!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
