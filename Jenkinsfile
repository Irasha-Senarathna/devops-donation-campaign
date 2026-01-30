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
                        ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST '
                            set -e
                            mkdir -p ~/donation-app
                            cat > ~/donation-app/docker-compose.yml << "EOD"
'"$(cat docker-compose.yml)"'
EOD

                            echo "Removing old containers..."
                            docker rm -f donation-backend donation-frontend mongodb || true

                            echo "Pulling latest images..."
                            docker-compose -f ~/donation-app/docker-compose.yml pull

                            echo "Stopping old containers..."
                            docker-compose -f ~/donation-app/docker-compose.yml down --remove-orphans

                            echo "Starting new containers..."
                            docker-compose -f ~/donation-app/docker-compose.yml up -d

                            echo "Waiting 40s for containers to initialize..."
                            sleep 40

                            echo "Current container status:"
                            docker ps
                        '
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST '
                            echo "Checking backend..."
                            curl -f http://localhost:5000/api/health && echo "✅ Backend is up!" || (echo "❌ Backend not ready"; exit 1)
                            echo "Checking frontend..."
                            curl -f http://localhost:3000 && echo "✅ Frontend is up!" || (echo "❌ Frontend not ready"; exit 1)
                        '
                    '''
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
