import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { OrganizationsModule } from './organizations/organizations.module.js';
import { MembershipsModule } from './memberships/memberships.module.js';
import { OutlinesModule } from './outlines/outlines.module.js';
import { json, urlencoded } from 'express';

import { AppController } from './app.controller.js';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Database
        PrismaModule,

        // Features
        AuthModule,
        OrganizationsModule,
        MembershipsModule,
        OutlinesModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(json(), urlencoded({ extended: true }))
            .exclude({ path: 'api/auth/(.*)', method: RequestMethod.ALL })
            .forRoutes('*');
    }
}
