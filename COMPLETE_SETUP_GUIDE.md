# 🚀 Complete CI/CD Setup Guide - Step by Step

This guide will help you deploy your Donation Campaign app to AWS using:
- **GitHub Actions** (for automatic Docker build & push)
- **Terraform** (to create AWS EC2 instance)
- **Ansible** (to configure EC2 and deploy the app)

---

## 📋 OVERVIEW - What We Will Do

```
YOUR CODE → GitHub → GitHub Actions → Docker Hub → EC2 (AWS)
```

1. Create AWS Account
2. Install required tools (AWS CLI, Terraform, Ansible)
3. Configure AWS CLI
4. Create EC2 instance using Terraform
5. Set up GitHub Actions to auto-build Docker images
6. Use Ansible to deploy the app on EC2

---

# PART 1: CREATE AWS ACCOUNT

## Step 1.1: Go to AWS Website
1. Open browser and go to: https://aws.amazon.com/
2. Click **"Create an AWS Account"** (top right corner)

## Step 1.2: Enter Your Details
1. **Email address**: Enter your email
2. **Password**: Create a strong password
3. **AWS account name**: Enter any name (e.g., "MyDevOpsAccount")
4. Click **"Continue"**

## Step 1.3: Contact Information
1. Select **"Personal"** account type
2. Fill in your:
   - Full name
   - Phone number
   - Country
   - Address
3. Click **"Continue"**

## Step 1.4: Payment Information
⚠️ **IMPORTANT**: AWS requires a credit/debit card, but we'll use FREE TIER resources!
1. Enter your card details
2. AWS may charge $1 for verification (refunded)
3. Click **"Verify and Continue"**

## Step 1.5: Phone Verification
1. Choose SMS or Voice call
2. Enter the verification code
3. Click **"Continue"**

## Step 1.6: Select Support Plan
1. Select **"Basic support - Free"**
2. Click **"Complete sign up"**

## Step 1.7: Wait for Activation
- AWS account activation takes 1-24 hours (usually few minutes)
- You'll receive an email when activated

---

# PART 2: CREATE IAM USER & ACCESS KEYS

⚠️ **IMPORTANT**: Never use your root account for daily work!

## Step 2.1: Sign in to AWS Console
1. Go to: https://console.aws.amazon.com/
2. Sign in with your email and password

## Step 2.2: Go to IAM
1. In the search bar at top, type **"IAM"**
2. Click on **"IAM"** service

## Step 2.3: Create IAM User
1. Click **"Users"** in left sidebar
2. Click **"Create user"** button
3. Enter username: `devops-user`
4. Click **"Next"**

## Step 2.4: Set Permissions
1. Select **"Attach policies directly"**
2. Search and check these policies:
   - ✅ `AmazonEC2FullAccess`
   - ✅ `AmazonVPCFullAccess`
3. Click **"Next"**
4. Click **"Create user"**

## Step 2.5: Create Access Keys
1. Click on the user you just created (`devops-user`)
2. Click **"Security credentials"** tab
3. Scroll down to **"Access keys"**
4. Click **"Create access key"**
5. Select **"Command Line Interface (CLI)"**
6. Check the confirmation box
7. Click **"Next"**
8. Click **"Create access key"**

## Step 2.6: SAVE YOUR KEYS! ⚠️
```
Access Key ID: AKIAXXXXXXXXXXXXXXXX
Secret Access Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
**SAVE THESE SOMEWHERE SAFE! You won't see the secret key again!**

Click **"Download .csv file"** to save them.

---

# PART 3: INSTALL REQUIRED TOOLS ON WINDOWS

## Step 3.1: Install AWS CLI

### Option A: Using MSI Installer (Easiest)
1. Download from: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Double-click the downloaded file
3. Follow the installation wizard
4. Click Next → Next → Install → Finish

### Option B: Using PowerShell (Run as Administrator)
```powershell
# Download AWS CLI
Invoke-WebRequest -Uri "https://awscli.amazonaws.com/AWSCLIV2.msi" -OutFile "AWSCLIV2.msi"

# Install silently
Start-Process msiexec.exe -Wait -ArgumentList '/I AWSCLIV2.msi /quiet'

# Clean up
Remove-Item AWSCLIV2.msi
```

### Verify Installation
Close and reopen PowerShell, then run:
```powershell
aws --version
```
You should see: `aws-cli/2.x.x Python/3.x.x Windows/10`

## Step 3.2: Install Terraform

### Option A: Using Chocolatey (If you have it)
```powershell
choco install terraform
```

### Option B: Manual Installation
1. Download from: https://developer.hashicorp.com/terraform/downloads
2. Click **"Windows"** → **"AMD64"**
3. Extract the ZIP file
4. Move `terraform.exe` to a folder (e.g., `C:\terraform\`)
5. Add to PATH:
   - Press `Win + X` → Select **"System"**
   - Click **"Advanced system settings"**
   - Click **"Environment Variables"**
   - Under "System variables", find **"Path"**, click **"Edit"**
   - Click **"New"**, add: `C:\terraform`
   - Click **OK** on all dialogs

### Verify Installation
Close and reopen PowerShell, then run:
```powershell
terraform --version
```

## Step 3.3: Install Ansible

⚠️ **Ansible doesn't run natively on Windows!** We have 2 options:

### Option A: Use WSL (Windows Subsystem for Linux) - RECOMMENDED

1. **Enable WSL** (Run PowerShell as Administrator):
```powershell
wsl --install
```

2. **Restart your computer**

3. **Open Ubuntu from Start menu**

4. **Create username and password** when prompted

5. **Install Ansible in Ubuntu/WSL**:
```bash
sudo apt update
sudo apt install ansible -y
ansible --version
```

### Option B: Use Ansible from EC2 (We'll do this later)
If WSL is too complex, we can run Ansible commands from the EC2 instance itself.

## Step 3.4: Install Git (If not installed)
1. Download from: https://git-scm.com/download/win
2. Install with default options

---

# PART 4: CONFIGURE AWS CLI

## Step 4.1: Open PowerShell and Configure
```powershell
aws configure
```

## Step 4.2: Enter Your Details
When prompted, enter:
```
AWS Access Key ID [None]: YOUR_ACCESS_KEY_ID
AWS Secret Access Key [None]: YOUR_SECRET_ACCESS_KEY
Default region name [None]: ap-south-1
Default output format [None]: json
```

📍 **Choose your region** (Examples):
- `ap-south-1` = Mumbai, India
- `us-east-1` = N. Virginia, USA
- `us-west-2` = Oregon, USA
- `eu-west-1` = Ireland

## Step 4.3: Verify Configuration
```powershell
aws sts get-caller-identity
```

You should see your account info:
```json
{
    "UserId": "AIDAXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/devops-user"
}
```

---

# PART 5: CREATE SSH KEY PAIR FOR EC2

## Step 5.1: Create Key Pair in AWS
```powershell
aws ec2 create-key-pair --key-name donation-app-key --query "KeyMaterial" --output text > donation-app-key.pem
```

## Step 5.2: Move Key to Safe Location
```powershell
# Create .ssh folder if it doesn't exist
mkdir -Force $HOME\.ssh

# Move the key
Move-Item donation-app-key.pem $HOME\.ssh\donation-app-key.pem
```

## Step 5.3: Note the Key Location
Your key is now at: `C:\Users\YOUR_USERNAME\.ssh\donation-app-key.pem`

---

# PART 6: CREATE DOCKER HUB ACCOUNT

## Step 6.1: Go to Docker Hub
1. Open: https://hub.docker.com/
2. Click **"Sign Up"**

## Step 6.2: Create Account
1. Enter username (e.g., `your-dockerhub-username`)
2. Enter email
3. Enter password
4. Click **"Sign Up"**
5. Verify your email

## Step 6.3: Create Access Token
1. Log in to Docker Hub
2. Click your profile icon (top right)
3. Click **"Account Settings"**
4. Click **"Security"** in left sidebar
5. Click **"New Access Token"**
6. Description: `github-actions`
7. Access permissions: **Read, Write, Delete**
8. Click **"Generate"**
9. **COPY THE TOKEN!** (You won't see it again)

Save this token somewhere safe!

---

# PART 7: SET UP GITHUB SECRETS

## Step 7.1: Go to Your GitHub Repository
1. Open your repository on GitHub
2. Click **"Settings"** tab
3. Click **"Secrets and variables"** → **"Actions"**

## Step 7.2: Add These Secrets
Click **"New repository secret"** for each:

| Name | Value |
|------|-------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | The access token from Step 6.3 |
| `AWS_ACCESS_KEY_ID` | Your AWS Access Key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS Secret Key |
| `EC2_SSH_PRIVATE_KEY` | Contents of donation-app-key.pem |
| `EC2_HOST` | (We'll add this later after EC2 is created) |

### How to add EC2_SSH_PRIVATE_KEY:
1. Open PowerShell:
```powershell
Get-Content $HOME\.ssh\donation-app-key.pem
```
2. Copy the ENTIRE output including:
```
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```
3. Paste it as the secret value

---

# PART 8: CREATE EC2 USING TERRAFORM

The Terraform files have been created in your `terraform/` folder.

## Step 8.1: Navigate to Terraform Folder
```powershell
cd "d:\project 5th sem\Devops\donation-campaign\terraform"
```

## Step 8.2: Initialize Terraform
```powershell
terraform init
```

## Step 8.3: Preview What Will Be Created
```powershell
terraform plan
```

## Step 8.4: Create the EC2 Instance
```powershell
terraform apply
```
Type `yes` when prompted.

## Step 8.5: Get EC2 Public IP
After terraform finishes, it will show:
```
Outputs:
ec2_public_ip = "XX.XX.XX.XX"
```

**COPY THIS IP ADDRESS!**

## Step 8.6: Add EC2_HOST to GitHub Secrets
1. Go back to GitHub → Settings → Secrets
2. Add new secret:
   - Name: `EC2_HOST`
   - Value: The IP address from Step 8.5

---

# PART 9: TEST SSH CONNECTION TO EC2

Wait 2-3 minutes after EC2 creation, then:

```powershell
ssh -i $HOME\.ssh\donation-app-key.pem ubuntu@YOUR_EC2_IP
```

If you see a prompt about fingerprint, type `yes`.

You should see: `ubuntu@ip-xx-xx-xx-xx:~$`

Type `exit` to disconnect.

---

# PART 10: RUN ANSIBLE TO SET UP EC2

## If Using WSL:

### Step 10.1: Open Ubuntu Terminal (WSL)

### Step 10.2: Navigate to Project
```bash
cd /mnt/d/project\ 5th\ sem/Devops/donation-campaign/ansible
```

### Step 10.3: Copy SSH Key to WSL
```bash
cp /mnt/c/Users/YOUR_USERNAME/.ssh/donation-app-key.pem ~/.ssh/
chmod 600 ~/.ssh/donation-app-key.pem
```

### Step 10.4: Update Inventory File
Edit the inventory file and add your EC2 IP:
```bash
nano inventory.ini
```
Replace `YOUR_EC2_IP_HERE` with your actual EC2 IP.

### Step 10.5: Test Ansible Connection
```bash
ansible all -i inventory.ini -m ping
```

### Step 10.6: Run Setup Playbook
```bash
ansible-playbook -i inventory.ini setup-ec2.yml
```

### Step 10.7: Run Deploy Playbook
```bash
ansible-playbook -i inventory.ini deploy.yml
```

---

# PART 11: PUSH CODE TO TRIGGER CI/CD

## Step 11.1: Commit and Push
```powershell
cd "d:\project 5th sem\Devops\donation-campaign"
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

## Step 11.2: Watch GitHub Actions
1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Watch the workflow run!

---

# PART 12: ACCESS YOUR DEPLOYED APPLICATION

After everything completes:

- **Frontend**: `http://YOUR_EC2_IP:3000`
- **Backend API**: `http://YOUR_EC2_IP:5000`

---

# 🔧 TROUBLESHOOTING

## Error: "Permission denied" when SSH
```powershell
# On Windows, right-click the .pem file → Properties → Security
# Remove all users except yourself
```

## Error: "terraform not recognized"
- Restart PowerShell after adding to PATH
- Or use full path: `C:\terraform\terraform.exe`

## Error: "Connection refused" to EC2
- Wait 2-3 minutes for EC2 to fully start
- Check security group allows your IP

## GitHub Actions Failed
- Check the Actions tab for error logs
- Verify all secrets are set correctly

---

# 📁 FILES CREATED

```
donation-campaign/
├── .github/
│   └── workflows/
│       └── docker-build-push.yml    # GitHub Actions workflow
├── ansible/
│   ├── inventory.ini                # Server list
│   ├── setup-ec2.yml               # Install Docker on EC2
│   └── deploy.yml                  # Deploy app on EC2
├── terraform/
│   ├── main.tf                     # EC2 configuration
│   ├── variables.tf                # Variable definitions
│   ├── outputs.tf                  # Output values
│   └── terraform.tfvars            # Your values
└── COMPLETE_SETUP_GUIDE.md         # This guide
```

---

# ✅ CHECKLIST

- [ ] AWS account created
- [ ] IAM user created with access keys
- [ ] AWS CLI installed and configured
- [ ] Terraform installed
- [ ] Ansible installed (WSL)
- [ ] Docker Hub account created
- [ ] GitHub secrets configured
- [ ] SSH key pair created
- [ ] EC2 instance created with Terraform
- [ ] Ansible setup playbook run
- [ ] First push to GitHub done
- [ ] Application accessible on EC2

---

Good luck! 🎉
