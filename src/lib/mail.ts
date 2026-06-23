import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({to, subject, text, html} 
    : {to: string, subject: string, text: string, html: string}) {
        console.log({to, subject, text});

        return resend.emails.send({
            from: 'onboarding@resend.trycatchlearn.com',
            to,
            subject,
            text,
            html
        })
}

export function getEmailHtml({ heading, body, buttonText, buttonUrl }: {
    heading: string;
    body: string;
    buttonText: string;
    buttonUrl: string;
}) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #333;">${heading}</h2>
            <p style="color: #666;">${body}</p>
            <a href="${buttonUrl}" style="display: inline-block; padding: 14px 28px; background-color: #0485f7; color: #ffffff; text-decoration: none; border-radius: 8px; margin: 16px 0; font-weight: 500;">${buttonText}</a>
            <p style="color: #999; font-size: 12px;">If the button doesn't work, copy this link: ${buttonUrl}</p>
        </div>
    `;
}