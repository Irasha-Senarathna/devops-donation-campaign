pipeline {
    agent any

    environment {
        DOCKERHUB_USER     = 'irashasenarathna'
        DOCKERHUB_PASSWORD = credentials('docker-hub-token')
        EC2_HOST           = '13.232.8.19'   // ✅ FIXED (NO credentials)
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Irasha-Senarathna/devops-donation-campaign.git',
                    credentialsId: 'github-pat'
            }
        }

        stage('Docker Login') {
            steps {
                sh '''
                  echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USER" --password-stdin
                '''
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                  docker build -t $DOCKERHUB_USER/donation-backend:latest ./backend
                  docker build -t $DOCKERHUB_USER/donation-frontend:latest ./frontend
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                  docker push $DOCKERHUB_USER/donation-backend:latest
                  docker push $DOCKERHUB_USER/donation-frontend:latest
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST << 'EOF'
                      set -e

                      mkdir -p ~/donation-app
                      cd ~/donation-app

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
    image: irashasenarathna/donation-backend:latest
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
    image: irashasenarathna/donation-frontend:latest
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongo-data:
EOC

                      # ✅ Support both compose versions
                      if command -v docker-compose >/dev/null 2>&1; then
                        docker-compose down || true
                        docker-compose pull
                        docker-compose up -d
                      else
                        docker compose down || true
                        docker compose pull
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
                  sleep 20

                  for i in {1..5}; do
                    curl -f http://$EC2_HOST:5000/api/health && break
                    echo "Retry backend..."
                    sleep 5
                  done

                  for i in {1..5}; do
                    curl -f http://$EC2_HOST:3000 && break
                    echo "Retry frontend..."
                    sleep 5
                  done
                '''
            }
        }
    }

    post {
        success {
            echo "✅ DEPLOYMENT SUCCESSFUL"
        }
        failure {
            echo "❌ DEPLOYMENT FAILED — check logs above"
        }
    }
}
