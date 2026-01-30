pipeline {
    agent any

    environment {
        EC2_HOST = '13.204.67.80'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Irasha-Senarathna/devops-donation-campaign.git',
                    credentialsId: 'github-pat'
            }
        }

        stage('Deploy & Build on EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                    echo "🔑 Testing SSH connectivity..."
                    ssh -o ConnectTimeout=15 -o StrictHostKeyChecking=no ubuntu@$EC2_HOST "echo SSH_OK"

                    echo "🚀 Connected. Deploying..."

                    ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST << 'EOF'
                      set -e

                      echo "🛑 Stopping containers using ports 5000 & 3000 (if any)"
                      docker ps --format "{{.ID}} {{.Ports}}" | grep -E "0.0.0.0:5000|0.0.0.0:3000" | awk '{print $1}' | xargs -r docker stop
                      docker ps -a --format "{{.ID}} {{.Ports}}" | grep -E "0.0.0.0:5000|0.0.0.0:3000" | awk '{print $1}' | xargs -r docker rm

                      echo "🧹 Cleaning old docker resources"
                      docker network prune -f || true

                      echo "📁 Resetting app directory"
                      rm -rf ~/donation-app
                      mkdir -p ~/donation-app
                      cd ~/donation-app

                      echo "📥 Cloning repository fresh"
                      git clone https://github.com/Irasha-Senarathna/devops-donation-campaign.git .

                      echo "🧱 Writing docker-compose.yml"
                      cat > docker-compose.yml << 'EOC'
version: '3.9'
services:
  mongo:
    image: mongo:6.0
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db
    ports:
      - "27018:27017"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGO_URI: mongodb://mongo:27017/donation_db
      JWT_SECRET: change_this
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongo-data:
EOC

                      echo "🐳 Deploying containers"

                      if command -v docker-compose >/dev/null 2>&1; then
                        echo "➡ Using docker-compose (v1)"
                        docker-compose down --remove-orphans || true
                        docker-compose build
                        docker-compose up -d
                      elif docker compose version >/dev/null 2>&1; then
                        echo "➡ Using docker compose (v2)"
                        docker compose down --remove-orphans || true
                        docker compose build
                        docker compose up -d
                      else
                        echo "❌ Docker Compose not installed"
                        exit 1
                      fi

                      echo "📦 Running containers:"
                      docker ps
EOF
                    '''
                }
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                  echo "⏳ Waiting for services..."
                  sleep 35
                  curl -f http://$EC2_HOST:5000/api/health
                  curl -f http://$EC2_HOST:3000
                '''
            }
        }
    }

    post {
        success {
            echo """
✅ DEPLOYMENT SUCCESSFUL
Frontend: http://$EC2_HOST:3000
Backend:  http://$EC2_HOST:5000
"""
        }
        failure {
            echo "❌ DEPLOYMENT FAILED — see logs above"
        }
    }
}
