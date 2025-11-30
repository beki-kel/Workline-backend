# Workline Backend - Production NestJS Auth System

A production-ready NestJS backend with Better Auth for authentication, multi-organization management with role-based access control, PostgreSQL database, and comprehensive API documentation.

## Features

✅ **Authentication** - Email/password + Google OAuth via Better Auth  
✅ **Email Verification** - Secure email verification flow  
✅ **Multi-Organization** - Complete organization management  
✅ **Role-Based Access** - OWNER and MEMBER roles with proper authorization  
✅ **Invitation System** - Invite users to organizations via email  
✅ **Session Management** - Secure cookie-based sessions  
✅ **API Documentation** - Interactive Swagger UI at `/api/docs`  
✅ **Type Safety** - Full TypeScript with Prisma ORM  
✅ **Docker Ready** - Production-ready containerization  

## Tech Stack

- **Framework**: NestJS 10
- **Auth**: Better Auth
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Validation**: class-validator
- **API Docs**: Swagger/OpenAPI
- **Runtime**: Node.js 20

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)
- npm or yarn

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database URL and secrets
```

3. Generate Prisma Client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

4. Start the development server:

```bash
npm run start:dev
```

5. Open Swagger documentation:

```
http://localhost:3000/api/docs
```

## Environment Variables

See `.env.example` for all required configuration. Key variables:

- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `BETTER_AUTH_SECRET` - Secret key for auth (min 32 characters)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret (optional)

## API Endpoints

### Authentication (`/api/auth/*`)

- `POST /api/auth/sign-up` - Register with email/password
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/verify-email` - Verify email address
- `GET /api/auth/oauth/google` - Google OAuth login

### Organizations (`/api/organizations`)

- `POST /api/organizations` - Create organization
- `GET /api/organizations` - List user's organizations
- `GET /api/organizations/:id` - Get organization details
- `PATCH /api/organizations/:id` - Update organization (owner only)
- `DELETE /api/organizations/:id` - Delete organization (owner only)

### Members (`/api/organizations/:id/members`)

- `GET /api/organizations/:id/members` - List members
- `DELETE /api/organizations/:id/members/:userId` - Remove member (owner only)
- `PATCH /api/organizations/:id/transfer-ownership` - Transfer ownership

### Invitations (`/api/organizations/:id/invitations`)

- `POST /api/organizations/:id/invitations` - Send invitation (owner only)
- `GET /api/organizations/:id/invitations` - List pending invitations
- `POST /api/invitations/:token/accept` - Accept invitation

## Database Schema

The application uses the following main models:

- **User** - User accounts (managed by Better Auth)
- **Session** - User sessions (managed by Better Auth)
- **Account** - OAuth accounts (managed by Better Auth)
- **Organization** - Organizations/workspaces
- **Membership** - User-Organization relationships with roles
- **Invitation** - Pending organization invitations

## Development

```bash
# Run in development mode
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Lint code
npm run lint

# Format code
npm run format

# Open Prisma Studio
npm run prisma:studio
```

## Docker Deployment

### Using Docker Compose (with local PostgreSQL)

```bash
docker-compose up -d
```

### Using Docker (with external database)

```bash
# Build image
docker build -t workline-backend .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-postgres-url" \
  -e BETTER_AUTH_SECRET="your-secret" \
  workline-backend
```

## Production Deployment

1. Set up PostgreSQL database (Neon recommended)
2. Configure environment variables
3. Run database migrations:
   ```bash
   npm run prisma:migrate:deploy
   ```
4. Build and start:
   ```bash
   npm run build
   npm run start:prod
   ```

## Architecture

The application follows clean architecture principles:

```
src/
├── auth/              # Better Auth integration
├── common/            # Shared utilities, guards, decorators
├── config/            # Configuration files
├── database/          # Prisma service and module
├── invitations/       # Invitation management
├── memberships/       # Organization membership
├── organizations/     # Organization CRUD
├── app.module.ts      # Root module
└── main.ts           # Application entry point
```

## Security Features

- ✅ Session-based authentication with secure cookies
- ✅ Email verification for new accounts
- ✅ Role-based authorization guards
- ✅ CORS protection
- ✅ Input validation with class-validator
- ✅ SQL injection protection via Prisma
- ✅ Environment variable validation

## License

MIT
