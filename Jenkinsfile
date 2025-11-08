pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'irashasenarathna'
        DOCKERHUB_PASSWORD = credentials('github-pat') // Docker Hub credential
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/Irasha-Senarathna/devops-donation-campaign.git',
                    credentialsId: 'github-pat'  // <-- use this
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
                sh 'echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USER --password-stdin'
                sh 'docker push $DOCKERHUB_USER/donation-frontend:latest'
                sh 'docker push $DOCKERHUB_USER/donation-backend:latest'
            }
        }
    }
}
