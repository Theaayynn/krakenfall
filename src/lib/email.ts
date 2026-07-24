import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const smtpTransport =
  process.env.SMTP_HOST && process.env.SMTP_USER
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      })
    : null;

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
  const from = process.env.EMAIL_FROM || "Krakenfall <no-reply@krakenfall.com>";
  if (resend) {
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) throw new Error(`Resend error: ${error.message}`);
    return;
  }
  if (smtpTransport) {
    await smtpTransport.sendMail({ from, to, subject, html });
    return;
  }
  console.warn(`[email] No RESEND_API_KEY or SMTP configured — logging instead.\nTo: ${to}\nSubject: ${subject}`);
}

function layout(bodyHtml: string): string {
  return `
  <div style="background:#04060A; padding:32px 16px; font-family: Georgia, serif;">
    <div style="max-width:480px; margin:0 auto; background:#0A0F1C; border:1px solid rgba(201,162,75,0.2); border-radius:12px; padding:32px; color:#EDE4D3;">
      <p style="margin:0 0 24px; font-size:14px; letter-spacing:0.15em; text-transform:uppercase; color:#C9A24B;">Krakenfall</p>
      ${bodyHtml}
    </div>
  </div>`;
}

export function verifyEmailTemplate(name: string, verifyUrl: string): string {
  return layout(`
    <h2 style="margin:0 0 12px; font-size:20px;">Welcome aboard, ${name}</h2>
    <p style="margin:0 0 20px; color:rgba(237,228,211,0.7); font-size:14px; line-height:1.6;">Confirm your email to claim your place in the crew roster.</p>
    <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#C9A24B;color:#04060A;border-radius:8px;text-decoration:none;font-weight:600;">Verify Email</a>
  `);
}

export function resetPasswordTemplate(name: string, resetUrl: string): string {
  return layout(`
    <h2 style="margin:0 0 12px; font-size:20px;">Reset your password</h2>
    <p style="margin:0 0 20px; color:rgba(237,228,211,0.7); font-size:14px; line-height:1.6;">Hi ${name}, a request came in to reset your password. This link expires in 1 hour.</p>
    <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#C9A24B;color:#04060A;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
  `);
}

export function contactNotificationTemplate(name: string, email: string, message: string): string {
  return layout(`
    <h2 style="margin:0 0 16px; font-size:18px;">New message from the harbor</h2>
    <p style="margin:0 0 4px; color:rgba(237,228,211,0.5); font-size:13px;">${name} · ${email}</p>
    <p style="margin:12px 0 0; font-size:14px; line-height:1.6;">${message}</p>
  `);
}
