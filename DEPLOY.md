# Deployment Guide for Ubuntu VPS

This guide explains how to deploy the Workline backend to an Ubuntu 22.04 VPS using Docker and Docker Compose.

## Prerequisites

1.  **Ubuntu VPS**: A server running Ubuntu 22.04.
2.  **Domain Name** (Optional but recommended): Pointed to your VPS IP.
3.  **SSH Access**: You should be able to SSH into your server.

## 1. Install Docker & Docker Compose

Run the following commands on your VPS to install Docker:

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Verify installation:
```bash
docker compose version
```

## 2. Prepare the Application

You can either clone your repository using Git or copy the files manually.

### Option A: Using Git (Recommended)
1.  **Generate an SSH key** (if your repo is private) and add it to GitHub/GitLab.
    ```bash
    ssh-keygen -t ed25519 -C "your_email@example.com"
    cat ~/.ssh/id_ed25519.pub
    ```
2.  **Clone the repo**:
    ```bash
    git clone <your-repo-url> app
    cd app
    ```

### Option B: Copy Files
Copy `docker-compose.yml`, `Dockerfile`, `package.json`, `pnpm-lock.yaml`, and `prisma/` to a folder on your server (e.g., `~/app`).

## 3. Configuration

1.  In your app directory, create a `.env` file:
    ```bash
    nano .env
    ```
2.  Paste your production environment variables. **Important:**
    - `DATABASE_URL`: If using the built-in Postgres service, use:
      `postgresql://postgres:your_secret_password@postgres:5432/workline?schema=public`
    - `POSTGRES_PASSWORD`: `your_secret_password` (Must match the password in DATABASE_URL).
    - `NODE_ENV`: `production`

## 4. Run the Application

1.  **Build and Start**:
    ```bash
    docker compose up -d --build
    ```

2.  **Initialize Database (First Time Only)**:
    Since this is a fresh deployment, you must push the schema to the database:
    ```bash
    docker compose exec app sh -c "npm install -g prisma && prisma db push"
    ```

3.  **Check Logs**:
    ```bash
    docker compose logs -f
    ```

## 5. Maintenance

- **Update Application**:
    ```bash
    git pull
    docker compose up -d --build
    ```

- **Stop Application**:
    ```bash
    docker compose down
    ```
