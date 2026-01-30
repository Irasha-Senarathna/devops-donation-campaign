pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'irashasenarathna'
        DOCKERHUB_PASSWORD = credentials('docker-hub-token')
        EC2_HOST = credentials('ec2-host')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/Irasha-Senarathna/devops-donation-campaign.git',
                    credentialsId: 'github-pat'
            }
        }

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

        stage('Push to Docker Hub') {
            steps {
                sh '''
                    echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USER --password-stdin
                    docker push $DOCKERHUB_USER/donation-frontend:latest
                    docker push $DOCKERHUB_USER/donation-backend:latest
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        set -euxo pipefail

                        # create local docker-compose with variables expanded
                        cat > docker-compose.yml <<EOF
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
    image: ${DOCKERHUB_USER}/donation-backend:latest
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
    image: ${DOCKERHUB_USER}/donation-frontend:latest
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
EOF

                        sed -n '1,200p' docker-compose.yml

                        ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST 'mkdir -p ~/donation-app'
                        scp -o StrictHostKeyChecking=no docker-compose.yml ubuntu@$EC2_HOST:~/donation-app/docker-compose.yml

                        ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST bash -lc "
                          set -euxo pipefail

                          if ! command -v docker >/dev/null; then
                            echo 'docker missing — installing'
                            sudo apt-get update -y
                            sudo apt-get install -y ca-certificates curl gnupg lsb-release
                            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
                            echo \"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
                            sudo apt-get update -y
                            sudo apt-get install -y docker-ce docker-ce-cli containerd.io
                            sudo usermod -aG docker \$USER || true
                          fi

                          if ! command -v docker-compose >/dev/null; then
                            echo 'docker-compose missing — installing'
                            sudo curl -L \"https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose
                            sudo chmod +x /usr/local/bin/docker-compose
                          fi

                          docker --version
                          docker-compose --version

                          echo '$DOCKERHUB_PASSWORD' | docker login -u '$DOCKERHUB_USER' --password-stdin

                          cd ~/donation-app
                          docker-compose pull
                          docker-compose down --remove-orphans || true
                          docker-compose up -d

                          sleep 10
                          docker ps
                        "
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Checking application health..."
                    sleep 10
                    curl -f http://$EC2_HOST:3000 && echo "✅ Frontend is up!"
                    curl -f http://$EC2_HOST:5000/api/health && echo "✅ Backend is up!"
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
            echo '❌ Deployment failed! Check the logs above.'
        }
    }
}
