import nodemailer from 'nodemailer';

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

if (!smtpUser || !smtpPass) {
    console.warn('⚠️ SMTP_USER or SMTP_PASSWORD is missing. Email sending may fail.');
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
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.EMAIL_FROM || '"Workline" <noreply@workline.com>',
            to,
            subject,
            text,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
