import nodemailer from "nodemailer";

import { config } from "@/lib/config";
import { logger } from "@/lib/logger";

function getTransport() {
  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
}

export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const transport = getTransport();
  if (!transport) {
    logger.warn("SMTP not configured; email suppressed", {
      to: args.to,
      subject: args.subject,
    });
    return;
  }

  await transport.sendMail({
    from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${config.appUrl}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify your Polaris Pilot email",
    text: `Verify your email by visiting ${url}`,
    html: `<p>Verify your Polaris Pilot account by clicking <a href="${url}">this secure link</a>.</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${config.appUrl}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Reset your Polaris Pilot password",
    text: `Reset your password by visiting ${url}`,
    html: `<p>Reset your Polaris Pilot password by clicking <a href="${url}">this secure link</a>.</p>`,
  });
}
