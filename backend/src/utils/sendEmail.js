import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) return false;

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    text,
    html
  });

  return true;
};
