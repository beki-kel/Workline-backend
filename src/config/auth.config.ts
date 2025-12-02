import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { organization } from 'better-auth/plugins';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { sendEmail } from '../common/utils/email.js';

const getTemplate = (templateName: string, replacements: Record<string, string>) => {
    const templatePath = path.join(process.cwd(), 'templates', templateName);
    let template = fs.readFileSync(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(replacements)) {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return template;
};

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
        requireEmailVerification: true,
        resetPasswordTokenExpiresIn: 60 * 30, // 30 minutes (in seconds)

        sendResetPassword: async ({ user, url }, request) => {
            console.log('🔔 Sending password reset email to:', user.email);
            console.log('🔗 Reset URL:', url);

            try {
                await sendEmail({
                    to: user.email,
                    subject: "Reset your password",
                    text: `Click the link to reset your password: ${url}`,
                    html: getTemplate('password-reset.html', {
                        TITLE: 'Reset your password',
                        MESSAGE: 'You requested to reset your password. Click the button below to reset it.',
                        ACTION_URL: url,
                        ACTION_TEXT: 'Reset Password',
                        SECURITY_TIP: 'If you did not request a password reset, please ignore this email or contact support if you have concerns.',
                    }),
                });
                console.log('✅ Password reset email sent successfully to:', user.email);
            } catch (error) {
                console.error('❌ Error sending reset password email:', error);
                throw error;
            }
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }: { user: { email: string }, url: string }) => {
            console.log('🔔 Sending verification email to:', user.email);
            console.log('🔗 Verification URL:', url);

            try {
                await sendEmail({
                    to: user.email,
                    subject: "Verify your email address",
                    text: `Click the link to verify your email: ${url}`,
                    html: getTemplate('email-verification.html', {
                        TITLE: 'Verify your email address',
                        MESSAGE: 'Welcome to Workline! Please verify your email address to get started.',
                        ACTION_URL: url,
                        ACTION_TEXT: 'Verify Email',
                        SECURITY_TIP: 'If you did not sign up for Workline, please ignore this email.',
                    }),
                });
                console.log('✅ Verification email sent successfully to:', user.email);
            } catch (error) {
                console.error('❌ Error sending verification email:', error);
                throw error;
            }
        },
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
                console.log('🔔 Sending invitation email to:', data.email);
                console.log('📦 Invitation Data:', JSON.stringify(data, null, 2));

                try {
                    const inviteLink = `${process.env.APP_URL || 'http://localhost:3001'}/accept-invitation/${data.id}`;
                    console.log('🔗 Invite Link:', inviteLink);

                    await sendEmail({
                        to: data.email,
                        subject: `You've been invited to join ${data.organization.name}`,
                        text: `You have been invited to join ${data.organization.name} as a ${data.role}. Click here to accept: ${inviteLink}`,
                        html: getTemplate('organization-invitation.html', {
                            TITLE: 'You have been invited!',
                            MESSAGE: `You have been invited to join the organization "${data.organization.name}".`,
                            ORGANIZATION_NAME: data.organization.name,
                            ROLE: data.role,
                            ACTION_URL: inviteLink,
                            ACTION_TEXT: 'Accept Invitation',
                        }),
                    });

                    console.log('✅ Invitation email sent successfully to:', data.email);
                } catch (error) {
                    console.error('❌ Error sending invitation email:', error);
                    throw error;
                }
            },
        }),
    ],

    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: '/api/auth',

    trustedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',

        process.env.APP_URL || '',
    ].filter(Boolean),

    advanced: {
        defaultCookieAttributes: {
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        },
    },
});

export type AuthSession = typeof auth.$Infer.Session;
