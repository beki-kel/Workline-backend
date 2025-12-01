import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bodyParser: false,
    });

    // Global prefix
    app.setGlobalPrefix('api');

    // Cookie parser for Better Auth sessions
    app.use(cookieParser());

    // Enable body parsing (since we disabled default bodyParser)
    const express = require('express');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // CORS configuration
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            process.env.APP_URL || '',
        ].filter(Boolean),
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('Workline Backend API')
        .setDescription(
            'Production NestJS backend with Better Auth authentication, multi-organization management, and role-based access control',
        )
        .setVersion('1.0')
        .addTag('Authentication', 'User authentication and session management')
        .addTag('Organizations', 'Organization CRUD operations')
        .addTag('Memberships', 'Organization member management')
        .addTag('Invitations', 'Organization invitation system')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'Session',
                description: 'Enter your session token (from cookies)',
            },
            'bearer',
        )
        .addCookieAuth('session', {
            type: 'apiKey',
            in: 'cookie',
            name: 'session',
            description: 'Session cookie from Better Auth',
        })
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
        customSiteTitle: 'Workline API Docs',
    });

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  🚀 Workline Backend is running!                         ║
║                                                           ║
║  📡 Server:     http://localhost:${port}                     ║
║  📚 API Docs:   http://localhost:${port}/api/docs            ║
║  🔐 Auth:       http://localhost:${port}/api/auth            ║
║                                                           ║
║  Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
