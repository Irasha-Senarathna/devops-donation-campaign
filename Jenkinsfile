pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'irashasenarathna'
        EC2_HOST = '13.204.67.80'
    }

    stages {

        // Stage 1: Checkout Code
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Irasha-Senarathna/devops-donation-campaign.git',
                    credentialsId: 'github-pat'
            }
        }

        // Stage 2: Build Docker Images on Jenkins
        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        sh 'docker build -t $DOCKERHUB_USER/donation-frontend:latest ./frontend'
                    }
                }
                stage('Build Backend') {
                    steps {
                        sh 'docker build -t $DOCKERHUB_USER/donation-backend:latest ./backend'
                    }
                }
            }
        }

        // Stage 3: Push to Docker Hub
        stage('Push to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-token', variable: 'DOCKERHUB_PASSWORD')]) {
                    sh '''
                        echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USER --password-stdin
                        docker push $DOCKERHUB_USER/donation-frontend:latest
                        docker push $DOCKERHUB_USER/donation-backend:latest
                    '''
                }
            }
        }

        // Stage 4: Deploy to EC2
        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        echo "🔑 Testing SSH connectivity..."
                        ssh -o ConnectTimeout=15 -o StrictHostKeyChecking=no ubuntu@13.204.67.80 "echo SSH_OK"

                        echo "🚀 Connected. Deploying..."

                        ssh -o StrictHostKeyChecking=no ubuntu@13.204.67.80 << 'EOF'
set -e

echo "🛑 Stopping old containers (if any)"
docker stop donation-frontend donation-backend mongodb 2>/dev/null || true
docker rm donation-frontend donation-backend mongodb 2>/dev/null || true

echo "🧹 Cleaning old docker resources"
docker network prune -f || true

echo "📁 Setting up app directory"
mkdir -p ~/donation-app
cd ~/donation-app

echo "🧱 Writing docker-compose.yml"
cat > docker-compose.yml << 'EOC'
version: '3.8'

services:
  mongodb:
    image: mongo:6
    container_name: mongodb
    restart: always
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  backend:
    image: irashasenarathna/donation-backend:latest
    container_name: donation-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGO_URI=mongodb://mongodb:27017/donation_db
      - JWT_SECRET=your_super_secret_jwt_key_change_in_production
    depends_on:
      - mongodb
    networks:
      - app-network

  frontend:
    image: irashasenarathna/donation-frontend:latest
    container_name: donation-frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  mongo-data:

networks:
  app-network:
    driver: bridge
EOC

echo "🐳 Pulling latest images from Docker Hub"
docker-compose pull

echo "🚀 Starting containers"
docker-compose down --remove-orphans || true
docker-compose up -d

echo "📦 Running containers:"
docker ps
EOF
                    '''
                }
            }
        }

        // Stage 5: Health Check
        stage('Health Check') {
            steps {
                sh '''
                    echo "⏳ Waiting for services to start..."
                    sleep 35
                    
                    echo "🔍 Checking Frontend..."
                    curl -f http://13.204.67.80:3000 || echo "Frontend check failed"
                    
                    echo "🔍 Checking Backend..."
                    curl -f http://13.204.67.80:5000/api/health || echo "Backend check failed"
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
Frontend: http://13.204.67.80:3000
Backend:  http://13.204.67.80:5000
========================================
"""
        }
        failure {
            echo '❌ DEPLOYMENT FAILED — see logs above'
        }
        always {
            sh 'docker system prune -f || true'
        }
    }
}
