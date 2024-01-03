import nodemailer from "nodemailer";

import { config } from "../config/config";

export class EmailService {
  private static instance: EmailService;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(destinationEmail: string, subject?: string, html?: string) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });

    await transporter.sendMail({
      from: config.smtpUser,
      to: destinationEmail,
      subject,
      html,
    });

    return { message: "mail sent" };
  }
}
