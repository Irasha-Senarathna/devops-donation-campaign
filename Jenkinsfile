pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'irashasenarathna'
        DOCKERHUB_PASSWORD = credentials('docker-hub-token')
        GITHUB_PAT = credentials('github-pat')
        ANSIBLE_KEY = 'donation-app-key.pem' // Jenkins credential ID if needed
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Terraform Init & Apply') {
            steps {
                dir('terraform') { // assume your Terraform files are in terraform/
                    sh '''
                        terraform init
                        terraform apply -auto-approve
                    '''
                }
            }
        }

        stage('Fetch EC2 Public IP') {
            steps {
                script {
                    // Read the Terraform output to get EC2 public IP
                    EC2_HOST = sh(
                        script: "cd terraform && terraform output -raw ec2_public_ip",
                        returnStdout: true
                    ).trim()
                    echo "EC2 Public IP: ${EC2_HOST}"
                }
            }
        }

        stage('Ansible Configure EC2') {
            steps {
                dir('ansible') { // your ansible playbooks are here
                    sh '''
                        # Create inventory file dynamically
                        echo "[web]" > inventory.ini
                        echo "${EC2_HOST} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/donation-app-key.pem" >> inventory.ini
                        
                        ansible-playbook -i inventory.ini site.yml
                    '''
                }
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

        stage('Push Docker Images') {
            steps {
                sh '''
                    echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USER --password-stdin
                    docker push $DOCKERHUB_USER/donation-frontend:latest
                    docker push $DOCKERHUB_USER/donation-backend:latest
                '''
            }
        }

        stage('Deploy Docker on EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                            mkdir -p ~/donation-app

                            # Remove old containers
                            docker rm -f donation-backend donation-frontend mongodb || true

                            # Create docker-compose.yml
                            cat > ~/donation-app/docker-compose.yml <<EOF
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

                            # Pull images and start containers
                            cd ~/donation-app
                            docker-compose pull
                            docker-compose down --remove-orphans || true
                            docker-compose up -d
                            sleep 15
                            docker ps
                        '
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    echo "Checking application health..."
                    sleep 10
                    curl -f http://${EC2_HOST}:3000 && echo "✅ Frontend is up!"
                    curl -f http://${EC2_HOST}:5000/api/health && echo "✅ Backend is up!"
                """
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
