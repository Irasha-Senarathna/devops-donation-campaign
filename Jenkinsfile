pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'irashasenarathna'
        DOCKERHUB_PASSWORD = credentials('docker-hub-token')
        EC2_HOST = credentials('ec2-host')
        DOCKER_BUILDKIT = '1'
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
                script {
                    retry(3) {
                        sh '''
                            echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USER --password-stdin
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        retry(3) {
                            sh '''
                                echo "Building frontend image..."
                                DOCKER_BUILDKIT=1 docker build --pull -t $DOCKERHUB_USER/donation-frontend:latest ./frontend
                            '''
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        retry(3) {
                            sh '''
                                echo "Building backend image..."
                                DOCKER_BUILDKIT=1 docker build --pull -t $DOCKERHUB_USER/donation-backend:latest ./backend
                            '''
                        }
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    retry(3) {
                        sh '''
                            docker push $DOCKERHUB_USER/donation-frontend:latest
                            docker push $DOCKERHUB_USER/donation-backend:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        # create docker-compose.yml
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
    healthcheck:
      test: ["CMD", "mongo", "--eval", "db.stats()"]
      interval: 10s
      retries: 5

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
      mongodb:
        condition: service_healthy
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 10s
      retries: 5

  frontend:
    image: ${DOCKERHUB_USER}/donation-frontend:latest
    container_name: donation-frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 10s
      retries: 5

volumes:
  mongo-data:

networks:
  app-network:
    driver: bridge
EOF

                        ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST '
                            set -e
                            mkdir -p ~/donation-app
                            cat > ~/donation-app/docker-compose.yml << "EOD"
'"$(cat docker-compose.yml)"'
EOD

                            docker rm -f donation-backend donation-frontend mongodb || true
                            docker-compose -f ~/donation-app/docker-compose.yml pull
                            docker-compose -f ~/donation-app/docker-compose.yml down --remove-orphans
                            docker-compose -f ~/donation-app/docker-compose.yml up -d

                            echo "Waiting for containers to become healthy..."
                            docker-compose -f ~/donation-app/docker-compose.yml wait
                            docker ps
                        '
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    retry(5) {
                        sh '''
                            echo "Checking frontend..."
                            curl -f http://$EC2_HOST:3000 && echo "✅ Frontend is up!" || (echo "Frontend not ready"; exit 1)
                            echo "Checking backend..."
                            curl -f http://$EC2_HOST:5000/api/health && echo "✅ Backend is up!" || (echo "Backend not ready"; exit 1)
                        '''
                    }
                }
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
