import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { auth } from '../../config/auth.config.js';

declare global {
    namespace Express {
        interface Request {
            user?: any;
            session?: any;
        }
    }
}

@Injectable()
export class SessionMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            // Log incoming request for debugging
            const cookies = req.cookies || {};
            const hasBetterAuthSession = cookies['better-auth.session_token'] || cookies['session_token'];

            console.log('🔐 Session Middleware:', {
                path: req.path,
                method: req.method,
                hasCookies: Object.keys(cookies).length > 0,
                hasBetterAuthSession: !!hasBetterAuthSession,
                cookieNames: Object.keys(cookies),
            });

            // Enhanced Bearer Token Support for cross-browser/mobile compatibility
            // If the client sends an Authorization header but no cookies (common in Safari/Firefox ITP or mobile),
            // we treat the Bearer token as the session token.
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                console.log('🔑 Bearer Token detected in header');

                // If better-auth only looks at cookies, we can polyfill it by adding to the cookie header
                // parsing the existing cookies string or creating a new one
                const currentCookie = req.headers.cookie || '';
                if (!currentCookie.includes('better-auth.session_token') && !currentCookie.includes('session_token')) {
                    console.log('🔄 Injecting Bearer token into Cookie header for Better Auth');
                    req.headers.cookie = currentCookie
                        ? `${currentCookie}; better-auth.session_token=${token}`
                        : `better-auth.session_token=${token}`;
                }
            }

            // Get session from Better Auth using the request
            const session = await auth.api.getSession({
                headers: req.headers as any,
            });

            if (session && session.user) {
                req.user = session.user;
                req.session = session.session;
                console.log('✅ Session validated for user:', session.user.email);
            } else {
                console.log('⚠️ No valid session found');
                req.user = null;
                req.session = null;
            }
        } catch (error) {
            // Session validation failed, continue without user
            console.error('❌ Session validation error:', error);
            console.error('   Error message:', (error as Error).message);
            req.user = null;
            req.session = null;
        }

        next();
    }
}
