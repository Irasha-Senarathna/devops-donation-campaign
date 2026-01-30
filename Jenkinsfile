pipeline {
    agent any

    environment {
        EC2_HOST = '13.232.8.19'
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
                    ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST << 'EOF'
                      set -e

                      echo "🚀 Preparing server..."
                      mkdir -p ~/donation-app
                      cd ~/donation-app

                      if [ ! -d .git ]; then
                        git clone https://github.com/Irasha-Senarathna/devops-donation-campaign.git .
                      else
                        git pull origin main
                      fi

                      echo "🧱 Writing docker-compose.yml..."
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

                      echo "🐳 Deploying containers..."
                      if command -v docker-compose >/dev/null 2>&1; then
                        docker-compose down || true
                        docker-compose build
                        docker-compose up -d
                      else
                        docker compose down || true
                        docker compose build
                        docker compose up -d
                      fi

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
                  sleep 25

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
            echo "❌ DEPLOYMENT FAILED — check logs"
        }
    }
}
