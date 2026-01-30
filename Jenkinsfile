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
                        # create docker-compose.yml locally with variables expanded
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

                        ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST '
                            set -x

                            # ensure app folder
                            mkdir -p ~/donation-app

                            # copy docker-compose
                            cat > ~/donation-app/docker-compose.yml << "EOD"
'"$(cat docker-compose.yml)"'
EOD

                            # Remove old containers safely
                            docker rm -f donation-backend donation-frontend mongodb || true

                            # Pull latest images
                            docker-compose -f ~/donation-app/docker-compose.yml pull || true

                            # Stop old containers safely
                            docker-compose -f ~/donation-app/docker-compose.yml down --remove-orphans || true

                            # Start containers
                            docker-compose -f ~/donation-app/docker-compose.yml up -d || true

                            sleep 15
                            docker ps
                        '
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
        Frontend: http://13.232.8.19:3000
        Backend:  http://13.232.8.19:5000
        ========================================
        """
    }
}
}
