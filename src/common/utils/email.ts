import nodemailer from 'nodemailer';

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

// Log SMTP configuration (without exposing password)
console.log('📧 SMTP Configuration:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    userConfigured: !!smtpUser,
    passwordConfigured: !!smtpPass,
    from: process.env.EMAIL_FROM || process.env.SMTP_FROM,
});

if (!smtpUser || !smtpPass) {
    console.error('❌ SMTP_USER or SMTP_PASSWORD is missing. Email sending will fail!');
    console.error('   SMTP_USER:', smtpUser ? 'SET' : 'NOT SET');
    console.error('   SMTP_PASSWORD:', smtpPass ? 'SET' : 'NOT SET');
}

const port = parseInt(process.env.SMTP_PORT || '587');
const isSecure = process.env.SMTP_SECURE === 'true' || port === 465;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: isSecure,
    auth: (smtpUser && smtpPass) ? {
        user: smtpUser,
        pass: smtpPass,
    } : undefined,
});

export const sendEmail = async ({
    to,
    subject,
    text,
    html,
}: {
    to: string;
    subject: string;
    text: string;
    html?: string;
}) => {
    console.log('📨 Attempting to send email:', {
        to,
        subject,
        from: process.env.SMTP_FROM || process.env.EMAIL_FROM,
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.EMAIL_FROM || '"Workline" <noreply@workline.com>',
            to,
            subject,
            text,
            html,
        });
        console.log('✅ Email sent successfully! Message ID:', info.messageId);
        console.log('   Response:', info.response);
        return info;
    } catch (error) {
        console.error('❌ CRITICAL: Email sending failed!');
        console.error('   Error details:', error);
        console.error('   Error message:', (error as Error).message);
        console.error('   Error stack:', (error as Error).stack);
        throw error;
    }
};
