# ==========================================
# QUICK COMMANDS REFERENCE
# ==========================================
# Copy and paste these commands as needed

# ==========================================
# PART 1: INSTALL TOOLS (Windows PowerShell as Admin)
# ==========================================

# Install AWS CLI
Invoke-WebRequest -Uri "https://awscli.amazonaws.com/AWSCLIV2.msi" -OutFile "AWSCLIV2.msi"
Start-Process msiexec.exe -Wait -ArgumentList '/I AWSCLIV2.msi /quiet'
Remove-Item AWSCLIV2.msi

# Verify AWS CLI
aws --version

# Install WSL (for Ansible)
wsl --install

# ==========================================
# PART 2: CONFIGURE AWS
# ==========================================

# Configure AWS CLI
aws configure

# Create SSH Key Pair
aws ec2 create-key-pair --key-name donation-app-key --query "KeyMaterial" --output text > donation-app-key.pem

# Move key to .ssh folder
mkdir -Force $HOME\.ssh
Move-Item donation-app-key.pem $HOME\.ssh\donation-app-key.pem

# Verify AWS configuration
aws sts get-caller-identity

# ==========================================
# PART 3: TERRAFORM COMMANDS
# ==========================================

# Navigate to terraform folder
cd "d:\project 5th sem\Devops\donation-campaign\terraform"

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Create EC2 instance
terraform apply

# Destroy EC2 instance (when you want to delete everything)
terraform destroy

# ==========================================
# PART 4: ANSIBLE COMMANDS (Run in WSL/Ubuntu)
# ==========================================

# Navigate to ansible folder (in WSL)
cd /mnt/d/project\ 5th\ sem/Devops/donation-campaign/ansible

# Copy SSH key to WSL (replace YOUR_USERNAME)
cp /mnt/c/Users/YOUR_USERNAME/.ssh/donation-app-key.pem ~/.ssh/
chmod 600 ~/.ssh/donation-app-key.pem

# Test connection
ansible all -i inventory.ini -m ping

# Setup EC2 (install Docker)
ansible-playbook -i inventory.ini setup-ec2.yml

# Deploy application
ansible-playbook -i inventory.ini deploy.yml

# ==========================================
# PART 5: GIT COMMANDS
# ==========================================

# Navigate to project
cd "d:\project 5th sem\Devops\donation-campaign"

# Add all files
git add .

# Commit
git commit -m "Add CI/CD pipeline"

# Push to GitHub
git push origin main

# ==========================================
# PART 6: SSH TO EC2
# ==========================================

# Connect to EC2 (replace YOUR_EC2_IP)
ssh -i $HOME\.ssh\donation-app-key.pem ubuntu@YOUR_EC2_IP

# ==========================================
# PART 7: DOCKER COMMANDS ON EC2
# ==========================================

# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Stop application
docker-compose down

# Start application
docker-compose up -d

# Pull latest images
docker-compose pull

# ==========================================
# USEFUL AWS CLI COMMANDS
# ==========================================

# List EC2 instances
aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]" --output table

# List key pairs
aws ec2 describe-key-pairs

# Get your account ID
aws sts get-caller-identity
