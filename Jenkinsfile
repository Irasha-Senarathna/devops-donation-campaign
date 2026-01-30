pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'irashasenarathna'
        DOCKERHUB_PASSWORD = credentials('docker-hub-token')
        GITHUB_PAT = credentials('github-pat')
    }

    stages {

        /* ---------------- CHECKOUT ---------------- */
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        /* ---------------- TERRAFORM ---------------- */
        stage('Terraform Apply') {
            when {
                expression { fileExists('terraform') }
            }
            steps {
                dir('terraform') {
                    sh '''
                        set -eux
                        terraform init
                        terraform apply -auto-approve
                    '''
                }
            }
        }

        stage('Terraform Skipped') {
            when {
                not { expression { fileExists('terraform') } }
            }
            steps {
                echo '⚠️ terraform/ folder not found — skipping'
            }
        }

        /* ---------------- FETCH EC2 IP ---------------- */
        stage('Fetch EC2 Public IP') {
            when {
                expression { fileExists('terraform') }
            }
            steps {
                script {
                    env.EC2_HOST = sh(
                        script: "cd terraform && terraform output -raw ec2_public_ip",
                        returnStdout: true
                    ).trim()

                    echo "✅ EC2 IP: ${env.EC2_HOST}"
                }
            }
        }

        /* ---------------- ANSIBLE ---------------- */
        stage('Ansible Configure EC2') {
            when {
                expression { fileExists('ansible') }
            }
            steps {
                sshagent(['ec2-ssh-key']) {
                    dir('ansible') {
                        sh '''
                            set -eux
                            echo "[web]" > inventory.ini
                            echo "$EC2_HOST ansible_user=ubuntu" >> inventory.ini
                            ansible-playbook -i inventory.ini site.yml
                        '''
                    }
                }
            }
        }

        stage('Ansible Skipped') {
            when {
                not { expression { fileExists('ansible') } }
            }
            steps {
                echo '⚠️ ansible/ folder not found — skipping'
            }
        }

        /* ---------------- DOCKER BUILD ---------------- */
        stage('Build Docker Images') {
            parallel {
                stage('Frontend') {
                    steps {
                        sh 'docker build -t $DOCKERHUB_USER/donation-frontend:latest ./frontend'
                    }
                }
                stage('Backend') {
                    steps {
                        sh 'docker build -t $DOCKERHUB_USER/donation-backend:latest ./backend'
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                sh '''
                    echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USER --password-stdin
                    docker push $DOCKERHUB_USER/donation-frontend:latest
                    docker push $DOCKERHUB_USER/donation-backend:latest
                '''
            }
        }

        /* ---------------- DEPLOY ---------------- */
        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST <<EOF
                        set -eux

                        mkdir -p ~/donation-app
                        cd ~/donation-app

                        docker rm -f donation-backend donation-frontend mongodb || true

                        cat > docker-compose.yml <<COMPOSE
version: "3.8"

services:
  mongodb:
    image: mongo:6
    volumes:
      - mongo-data:/data/db

  backend:
    image: irashasenarathna/donation-backend:latest
    ports:
      - "5000:5000"
    depends_on:
      - mongodb

  frontend:
    image: irashasenarathna/donation-frontend:latest
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongo-data:
COMPOSE

                        docker-compose pull
                        docker-compose down || true
                        docker-compose up -d
                        docker ps
EOF
                    '''
                }
            }
        }

        /* ---------------- HEALTH ---------------- */
        stage('Health Check') {
            steps {
                sh '''
                    sleep 10
                    curl -f http://$EC2_HOST:3000
                    curl -f http://$EC2_HOST:5000 || true
                '''
            }
        }
    }

    post {
        success {
            echo """
========================================
✅ DEPLOYMENT SUCCESSFUL!
========================================
Frontend: http://${EC2_HOST}:3000
Backend:  http://${EC2_HOST}:5000
========================================
"""
        }
        failure {
            echo '❌ Deployment failed — check logs above'
        }
    }
}
