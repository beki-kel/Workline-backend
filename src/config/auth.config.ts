import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { organization } from 'better-auth/plugins';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { sendEmail } from '../common/utils/email';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        },
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },

    plugins: [
        organization({
            allowUserToCreateOrganization: true,
            organizationLimit: 10,
            sendInvitationEmail: async (data) => {
                const inviteLink = `${process.env.APP_URL || 'http://localhost:3001'}/accept-invitation/${data.id}`;
                await sendEmail({
                    to: data.email,
                    subject: `You've been invited to join ${data.organization.name}`,
                    text: `You have been invited to join ${data.organization.name} as a ${data.role}. Click here to accept: ${inviteLink}`,
                    html: `<p>You have been invited to join <strong>${data.organization.name}</strong> as a <strong>${data.role}</strong>.</p><p><a href="${inviteLink}">Click here to accept</a></p>`,
                });
            },
        }) as any,
    ],

    secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key-min-32-characters',
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    basePath: '/api/auth',

    trustedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.APP_URL || '',
    ].filter(Boolean),
}) as any;

export type AuthSession = typeof auth.$Infer.Session;
