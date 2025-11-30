# 🚀 Workline Backend - Setup Guide

This guide will help you set up and run the Workline backend on your local machine or deploy it to production.

## Prerequisites

- **Node.js** 20+ and npm 10+
- **PostgreSQL** database (we recommend [Neon](https://neon.tech) for serverless Postgres)
- **Google Cloud Account** (optional, for Google OAuth)

## Step 1: Clone & Install

```bash
cd Workline-backend
npm install
```

✅ Dependencies installed successfully!

## Step 2: Database Setup

### Option A: Using Neon (Recommended)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string (it looks like: `postgresql://username:password@ep-xxx.neon.tech/dbname?sslmode=require`)

### Option B: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database: `createdb workline`
3. Your connection string: `postgresql://postgres:password@localhost:5432/workline`

### Option C: Docker Compose (Local Development)

```bash
docker-compose up -d postgres
```

Connection string: `postgresql://postgres:postgres@localhost:5432/workline`

## Step 3: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and update the following **required** variables:

```env
# Required: Update with your actual Neon database URL
DATABASE_URL="postgresql://username:password@your-neon-hostname.neon.tech/workline?sslmode=require"

# Required: Change to a secure random string (min 32 characters)
BETTER_AUTH_SECRET="your-super-secret-key-change-this-min-32-chars"
```

**Optional** - For Google OAuth (you can skip this initially):

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Setting up Google OAuth (Optional)

If you want to enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set authorized redirect URI to: `http://localhost:3000/api/auth/oauth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

## Step 4: Database Migration

Run Prisma migrations to create the database schema:

```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

This will:
- Generate the Prisma Client
- Create all necessary tables (users, organizations, memberships, invitations, sessions)
- Set up indexes and constraints

## Step 5: Start the Server

```bash
npm run start:dev
```

You should see:

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  🚀 Workline Backend is running!                         ║
║                                                           ║
║  📡 Server:     http://localhost:3000                     ║
║  📚 API Docs:   http://localhost:3000/api/docs            ║
║  🔐 Auth:       http://localhost:3000/api/auth            ║
║                                                           ║
║  Environment: development                                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

## Step 6: Verify Installation

Open your browser and visit:

- **API Documentation**: http://localhost:3000/api/docs
- You should see a beautiful Swagger UI with all API endpoints

## Step 7: Test the API

### Using Swagger UI

1. Go to http://localhost:3000/api/docs
2. Try the **POST /api/auth/sign-up** endpoint:
   ```json
   {
     "email": "test@example.com",
     "password": "SecurePass123!",
     "name": "Test User"
   }
   ```
3. Sign in with **POST /api/auth/sign-in**
4. Create an organization with **POST /api/organizations**

### Using cURL

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!","name":"Test User"}'

# Sign in
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'
```

## Additional Commands

```bash
# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm run start:prod

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t workline-backend .
```

### Run with Docker

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e BETTER_AUTH_SECRET="your-secret-key" \
  workline-backend
```

### Docker Compose (Full Stack)

```bash
docker-compose up -d
```

This starts both the backend and a local PostgreSQL database.

## Production Deployment

### Deploy to Any Platform

This app can be deployed to:

- **Vercel** (with Serverless Functions)
- **Railway**
- **Render**
- **Fly.io**
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Apps**

### Environment Variables for Production

Make sure to set these on your hosting platform:

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
BETTER_AUTH_SECRET=your-production-secret-key
APP_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Database Migrations in Production

```bash
npm run prisma:migrate:deploy
```

## Troubleshooting

### "Connection refused" error

- Make sure PostgreSQL is running
- Verify your `DATABASE_URL` is correct
- Check if you can connect to the database using `psql` or a database client

### "Prisma Client not generated"

```bash
npm run prisma:generate
```

### Port 3000 already in use

Change the `PORT` in your `.env` file:

```env
PORT=3001
```

### Better Auth errors

- Ensure `BETTER_AUTH_SECRET` is at least 32 characters long
- Make sure `BETTER_AUTH_URL` matches your server URL

## Support

For issues or questions:

1. Check the [README.md](./README.md) for API documentation
2. Review the [Prisma schema](./prisma/schema.prisma) for database structure
3. Explore the Swagger docs at `/api/docs`

## Next Steps

Now that your backend is running:

1. ✅ Test all authentication flows
2. ✅ Create organizations and invite members
3. ✅ Integrate with your frontend application
4. ✅ Set up email service for email verification
5. ✅ Configure Google OAuth for social login
6. ✅ Deploy to production

Happy coding! 🎉
