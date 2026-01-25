import { Resend } from 'resend';
import { env } from '@/env';

type SendEmailParams = {
  from: string;
  to: string[];
  subject: string;
  html: string;
};

class EmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async send(params: SendEmailParams): Promise<void> {
    await this.resend.emails.send(params);
  }
}

export const emailService = new EmailService();
