# Manual Deployment Guide (Ubuntu VPS)

This guide explains how to deploy the Workline backend directly on an Ubuntu VPS without Docker, using **PM2** to manage the process and **Nginx** as a reverse proxy.

## Prerequisites

- Ubuntu 20.04 or 22.04 Server
- Root or sudo access

## 1. Clean Up Docker (Optional)
If you want to stop the old Docker containers to free up ports:
```bash
docker compose down
```

## 2. Install Node.js & pnpm

Install Node.js (v20 or newer) and pnpm:

```bash
# 1. Install Node.js (using NVM is easiest, or setup from source)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Enable Corepack to get pnpm
sudo corepack enable
sudo corepack prepare pnpm@latest --activate
```

## 3. Clone & Setup Project

```bash
# Go to your app directory
cd ~/apps/workline-api/app

# Pull latest code
git pull

# Install ALL dependencies (including devDeps for build & prisma)
pnpm install

# Clear any old builds
rm -rf dist
```

## 4. Environment Configuration

Ensure your `.env` file is correct for production usage.
```bash
nano .env
```
Make sure `DATABASE_URL` matches your production database (e.g., Neon Postgres or local).

## 5. Build the Application

```bash
# Build the NestJS app
pnpm build
```

## 6. Database Setup

Run the migrations or push the schema:

```bash
# Generate Prisma Client
pnpm prisma generate

# Push schema to DB
pnpm prisma db push
```

## 7. Start with PM2

PM2 is a process manager that keeps your app alive.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the app
pm2 start dist/main.js --name workline-api

# Save the process list so it restarts on reboot
pm2 save
pm2 startup
```

## 8. Nginx Reverse Proxy (Optional but Recommended)

To expose your app on port 80/443 instead of 3000:

1. **Install Nginx**:
   ```bash
   sudo apt install nginx
   ```

2. **Configure Nginx**:
   ```bash
   sudo nano /etc/nginx/sites-available/workline
   ```
   Paste this content:
   ```nginx
   server {
       listen 80;
       server_name workline.api.shalops.com; # Your domain

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable Site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/workline /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Troubleshooting

- **Check Logs**: `pm2 logs workline-api`
- **Restart App**: `pm2 restart workline-api`
