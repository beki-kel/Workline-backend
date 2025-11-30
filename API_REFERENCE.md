# 📖 API Quick Reference

Complete endpoint reference for the Workline Backend API.

Base URL: `http://localhost:3000/api`

## 🔐 Authentication Endpoints

All auth endpoints are handled by Better Auth at `/api/auth/*`

### Sign Up
```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

### Sign In
```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Sign Out
```http
POST /api/auth/sign-out
Cookie: session=<session-token>
```

### Get Current Session
```http
GET /api/auth/session
Cookie: session=<session-token>
```

### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

### Google OAuth
```http
GET /api/auth/oauth/google
# Redirects to Google OAuth flow
```

## 🏢 Organization Endpoints

### Create Organization
```http
POST /api/organizations
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "name": "Acme Corporation",
  "slug": "acme-corp",  // Optional, auto-generated
  "description": "Leading provider of innovative solutions"  // Optional
}
```

**Response**: Organization object with creator as OWNER

### List My Organizations
```http
GET /api/organizations
Authorization: Bearer <session-token>
```

**Response**: Array of organizations where user is a member

### Get Organization Details
```http
GET /api/organizations/:id
Authorization: Bearer <session-token>
```

**Requirements**: User must be a member  
**Response**: Organization with members list

### Update Organization
```http
PATCH /api/organizations/:id
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "name": "New Organization Name",  // Optional
  "description": "Updated description"  // Optional
}
```

**Requirements**: User must be OWNER  
**Response**: Updated organization

### Delete Organization
```http
DELETE /api/organizations/:id
Authorization: Bearer <session-token>
```

**Requirements**: User must be OWNER  
**Response**: Success message

## 👥 Membership Endpoints

### List Organization Members
```http
GET /api/organizations/:organizationId/members
Authorization: Bearer <session-token>
```

**Requirements**: User must be a member  
**Response**: Array of memberships with user details

### Remove Member
```http
DELETE /api/organizations/:organizationId/members/:userId
Authorization: Bearer <session-token>
```

**Requirements**: User must be OWNER  
**Notes**: 
- Cannot remove yourself if you're the owner
- Transfer ownership first

### Transfer Ownership
```http
PATCH /api/organizations/:organizationId/transfer-ownership
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "newOwnerId": "user-id-of-new-owner"
}
```

**Requirements**: 
- User must be current OWNER
- New owner must already be a member
**Result**: 
- Current owner becomes MEMBER
- New owner becomes OWNER

## ✉️ Invitation Endpoints

### Send Invitation
```http
POST /api/organizations/:organizationId/invitations
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "role": "MEMBER"  // Optional, defaults to MEMBER
}
```

**Requirements**: User must be OWNER  
**Response**: Invitation object with token  
**Expiration**: 7 days

### List Pending Invitations
```http
GET /api/organizations/:organizationId/invitations
Authorization: Bearer <session-token>
```

**Requirements**: User must be OWNER  
**Response**: Array of pending invitations

### Accept Invitation
```http
POST /api/invitations/:token/accept
Authorization: Bearer <session-token>
```

**Requirements**: 
- User must be authenticated
- Invitation email must match user email
- Invitation must not be expired
**Response**: Created membership

## 🔑 Authorization Levels

| Endpoint | Authentication | Membership | Owner Required |
|----------|---------------|------------|----------------|
| Sign Up/In | ❌ | ❌ | ❌ |
| Create Org | ✅ | ❌ | ❌ |
| List My Orgs | ✅ | ❌ | ❌ |
| Get Org Details | ✅ | ✅ | ❌ |
| Update Org | ✅ | ✅ | ✅ |
| Delete Org | ✅ | ✅ | ✅ |
| List Members | ✅ | ✅ | ❌ |
| Remove Member | ✅ | ✅ | ✅ |
| Transfer Ownership | ✅ | ✅ | ✅ |
| Send Invitation | ✅ | ✅ | ✅ |
| List Invitations | ✅ | ✅ | ✅ |
| Accept Invitation | ✅ | ❌ | ❌ |

## 📝 Common Response Formats

### Success Response
```json
{
  "id": "clx1234567890",
  "name": "Acme Corporation",
  "slug": "acme-corporation",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation error message",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/organizations"
}
```

## 🔄 Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not authorized for this action)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## 🍪 Session Management

Sessions are managed via HTTP-only cookies set by Better Auth:

```
Cookie: session=<session-token>; HttpOnly; SameSite=Lax; Path=/
```

- **Expiration**: 7 days (configurable)
- **Security**: HttpOnly, SameSite protection
- **Auto-refresh**: Updated on each request

## 🧪 Testing with cURL

### Complete Flow Example

```bash
# 1. Sign up
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!","name":"Test User"}' \
  -c cookies.txt

# 2. Sign in (save cookies)
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}' \
  -c cookies.txt

# 3. Create organization (use cookies)
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"My Company","description":"My awesome company"}'

# 4. List my organizations
curl http://localhost:3000/api/organizations \
  -b cookies.txt
```

## 🎯 Best Practices

1. **Always include session cookies** for authenticated endpoints
2. **Validate inputs** - The API validates all inputs automatically
3. **Handle errors gracefully** - Check status codes and error messages
4. **Use Swagger UI** at `/api/docs` for interactive testing
5. **Secure your secrets** - Never commit `.env` file
6. **Use HTTPS** in production for cookie security

## 📚 Interactive Documentation

For the best experience, use the **Swagger UI**:

```
http://localhost:3000/api/docs
```

Features:
- Try out all endpoints
- See request/response schemas
- Automatic authentication handling
- Example payloads
- Response validation

## 🆘 Common Issues

### 401 Unauthorized
- Make sure you're signed in
- Include session cookie in requests
- Session may have expired (7 days)

### 403 Forbidden
- You don't have permission for this action
- Check if you're a member of the organization
- Verify you're the owner for owner-only actions

### 409 Conflict
- Resource already exists (e.g., duplicate email or slug)
- User already member of organization
- Pending invitation already exists

---

For detailed setup instructions, see [SETUP.md](./SETUP.md)  
For implementation details, see the [walkthrough](file:///Users/bereketkelay/.gemini/antigravity/brain/cb075637-d74a-45e5-94f3-8701fc42ae97/walkthrough.md)
