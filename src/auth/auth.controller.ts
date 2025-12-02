import { Controller, All, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { auth } from '../config/auth.config.js';

import { toNodeHandler } from 'better-auth/node';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    /**
     * Handle all Better Auth requests
     */
    @All('*')
    @ApiExcludeEndpoint()
    async handleAuth(@Req() req: Request, @Res() res: Response) {
        console.log('🔐 Auth Request:', req.method, req.url);
        console.log('📦 Body:', req.body);

        // Special logging for password reset
        if (req.url.includes('forget-password') || req.url.includes('reset-password')) {
            console.log('🔑 PASSWORD RESET REQUEST DETECTED');
            console.log('📧 Email in body:', req.body?.email);
            console.log('🎫 Token in body:', req.body?.token);
        }

        const nodeHandler = toNodeHandler(auth);
        return nodeHandler(req, res);
    }

    // Swagger documentation for auth endpoints
    // These are virtual endpoints for documentation only

    @ApiOperation({
        summary: 'Sign up with email and password',
        description: 'Register a new user account. Email verification will be sent.',
    })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['email', 'password', 'name'],
            properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                password: { type: 'string', minLength: 8, example: 'SecurePass123!' },
                name: { type: 'string', example: 'John Doe' },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input or email already exists' })
    signUp() {
        // This method is never called - it's for Swagger docs only
    }

    @ApiOperation({
        summary: 'Sign in with email and password',
        description: 'Authenticate and create a session',
    })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                password: { type: 'string', example: 'SecurePass123!' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    signIn() {
        // This method is never called - it's for Swagger docs only
    }

    @ApiOperation({
        summary: 'Sign out',
        description: 'Destroy the current session',
    })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    signOut() {
        // This method is never called - it's for Swagger docs only
    }

    @ApiOperation({
        summary: 'Get current session',
        description: 'Retrieve the authenticated user session',
    })
    @ApiResponse({
        status: 200,
        description: 'Current session',
        schema: {
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        emailVerified: { type: 'boolean' },
                    },
                },
                session: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        expiresAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Not authenticated' })
    getSession() {
        // This method is never called - it's for Swagger docs only
    }

    @ApiOperation({
        summary: 'Verify email address',
        description: 'Verify email using the token sent to user email',
    })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['token'],
            properties: {
                token: { type: 'string', example: 'verification-token-here' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Email verified successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    verifyEmail() {
        // This method is never called - it's for Swagger docs only
    }

    @ApiOperation({
        summary: 'Sign in with Google',
        description: 'Initiate Google OAuth flow',
    })
    @ApiResponse({ status: 302, description: 'Redirect to Google OAuth' })
    googleOAuth() {
        // This method is never called - it's for Swagger docs only
    }
}
