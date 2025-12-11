import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.user) {
            console.log(' Auth Guard: No user in request');
            throw new UnauthorizedException('You must be logged in to access this resource');
        }

        // Check if email is verified when email verification is required
        if (!request.user.emailVerified) {
            console.log(' Auth Guard: Email not verified for user:', request.user.email);
            throw new UnauthorizedException('Please verify your email address before accessing this resource');
        }

        console.log(' Auth Guard: Authorized user:', request.user.email);
        return true;
    }
}
