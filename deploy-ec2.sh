#!/bin/bash

# Job Portal Backend Deployment Script for EC2
# Run this script on your EC2 instance

set -e

echo "========================================="
echo "Job Portal Backend Deployment"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Update system
echo -e "${YELLOW}Step 1: Updating system...${NC}"
sudo apt update && sudo apt upgrade -y

# Step 2: Install Docker
echo -e "${YELLOW}Step 2: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io
    sudo usermod -aG docker ${USER}
    echo -e "${GREEN}Docker installed successfully!${NC}"
else
    echo -e "${GREEN}Docker is already installed${NC}"
fi

# Step 3: Install Docker Compose
echo -e "${YELLOW}Step 3: Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}Docker Compose installed successfully!${NC}"
else
    echo -e "${GREEN}Docker Compose is already installed${NC}"
fi

# Step 4: Install Java 17 (for building)
echo -e "${YELLOW}Step 4: Installing Java 17...${NC}"
if ! command -v java &> /dev/null; then
    sudo apt install -y openjdk-17-jdk
    echo -e "${GREEN}Java 17 installed successfully!${NC}"
else
    echo -e "${GREEN}Java is already installed${NC}"
fi

# Step 5: Install Maven
echo -e "${YELLOW}Step 5: Installing Maven...${NC}"
if ! command -v mvn &> /dev/null; then
    sudo apt install -y maven
    echo -e "${GREEN}Maven installed successfully!${NC}"
else
    echo -e "${GREEN}Maven is already installed${NC}"
fi

# Step 6: Clone repository (if not already present)
echo -e "${YELLOW}Step 6: Setting up project...${NC}"
read -p "Enter your GitHub repository URL: " REPO_URL

if [ -d "job-portal-backend" ]; then
    echo -e "${YELLOW}Project directory exists. Pulling latest changes...${NC}"
    cd job-portal-backend
    git pull
else
    echo -e "${YELLOW}Cloning repository...${NC}"
    git clone $REPO_URL job-portal-backend
    cd job-portal-backend
fi

# Step 7: Set JWT Secret
echo -e "${YELLOW}Step 7: Setting up environment variables...${NC}"
read -p "Enter JWT Secret (or press Enter to generate random): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated JWT Secret: $JWT_SECRET${NC}"
fi

# Create .env file
cat > .env <<EOF
JWT_SECRET=$JWT_SECRET
EOF

echo -e "${GREEN}.env file created${NC}"

# Step 8: Build the project
echo -e "${YELLOW}Step 8: Building Maven project...${NC}"
./mvnw clean install -DskipTests

echo -e "${GREEN}Build completed successfully!${NC}"

# Step 9: Deploy with Docker Compose
echo -e "${YELLOW}Step 9: Deploying with Docker Compose...${NC}"
sudo docker-compose down
sudo docker-compose up -d --build

# Step 10: Wait for services to start
echo -e "${YELLOW}Step 10: Waiting for services to start...${NC}"
sleep 30

# Step 11: Check status
echo -e "${YELLOW}Step 11: Checking service status...${NC}"
sudo docker-compose ps

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Your services are running at:"
echo "  - Eureka Server: http://$(curl -s ifconfig.me):8761"
echo "  - API Gateway: http://$(curl -s ifconfig.me):8080"
echo "  - User Service: http://$(curl -s ifconfig.me):8081"
echo "  - Job Service: http://$(curl -s ifconfig.me):8082"
echo "  - Application Service: http://$(curl -s ifconfig.me):8083"
echo ""
echo "To view logs: sudo docker-compose logs -f [service-name]"
echo "To stop services: sudo docker-compose down"
echo "To restart services: sudo docker-compose restart"
echo ""
echo -e "${YELLOW}Note: Make sure EC2 Security Group allows inbound traffic on these ports${NC}"