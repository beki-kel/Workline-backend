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
            // Get session from Better Auth
            const session = await auth.api.getSession({
                headers: req.headers as any,
            });

            if (session) {
                req.user = session.user;
                req.session = session.session;
            }
        } catch (error) {
            // Session validation failed, continue without user
            req.user = null;
            req.session = null;
        }

        next();
    }
}
