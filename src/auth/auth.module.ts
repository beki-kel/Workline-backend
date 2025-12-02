import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { SessionMiddleware } from './middleware/session.middleware.js';
import { AuthGuard } from './guards/auth.guard.js';

@Module({
    controllers: [AuthController],
    providers: [AuthGuard],
    exports: [AuthGuard],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Apply session middleware to all routes
        consumer.apply(SessionMiddleware).forRoutes('*');
    }
}
