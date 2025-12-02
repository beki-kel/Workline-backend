import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { MembershipsModule } from './memberships/memberships.module';
import { OutlinesModule } from './outlines/outlines.module';
import { json, urlencoded } from 'express';

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
    controllers: [],
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
