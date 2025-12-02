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
