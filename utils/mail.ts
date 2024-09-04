import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const SendVerificationEmail = async (email: string, token: string) => {
    const confirmationLink = `${process.env.NEXTAUTH_URL}/auth/new-verification?token=${token}`;
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to: email,
        subject: "Verify Your Email Address",
        html: `<p>Click the link below to verify your email address</p><a href="${confirmationLink}">Verify Email</a>`,
    })
}