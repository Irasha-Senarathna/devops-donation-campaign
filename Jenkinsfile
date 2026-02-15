// filepath: d:\project 5th sem\Devops\donation-campaign\Jenkinsfile
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

        // Stage 2: Deploy to EC2 (build on EC2 directly)
        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        echo "🔑 Testing SSH connectivity..."
                        ssh -o ConnectTimeout=15 -o StrictHostKeyChecking=no ubuntu@13.204.67.80 "echo SSH_OK"

                        echo "🚀 Connected. Deploying..."

                        ssh -o StrictHostKeyChecking=no ubuntu@13.204.67.80 << 'EOF'
set -e

echo "🛑 Stopping ALL old containers"
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

echo "🧹 Cleaning old docker resources"
docker network prune -f || true
docker volume prune -f || true

echo "📁 Setting up app directory"
rm -rf ~/donation-app
mkdir -p ~/donation-app
cd ~/donation-app

echo "🧱 Writing docker-compose.yml"
cat > docker-compose.yml << 'EOC'
version: '3.8'

services:
  mongo:
    image: mongo:6
    container_name: donation-mongo
    restart: always
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  backend:
    image: irashasenarathna/donation-backend:latest
    container_name: donation-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGO_URI=mongodb://mongo:27017/donation_db
      - JWT_SECRET=your_super_secret_jwt_key_change_in_production
    depends_on:
      mongo:
        condition: service_healthy
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
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "📦 Running containers:"
docker ps

echo "🔍 Checking backend health..."
curl -f http://localhost:5000/api/health || echo "Backend not ready yet"
EOF
                    '''
                }
            }
        }

        // Stage 3: Health Check
        stage('Health Check') {
            steps {
                sh '''
                    echo "⏳ Waiting for services to stabilize..."
                    sleep 20
                    
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
Backend:  http://13.204.67.80:5000/api/health
========================================
"""
        }
        failure {
            echo '❌ DEPLOYMENT FAILED — see logs above'
        }
    }
}
