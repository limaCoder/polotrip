import React from 'react';
import { render } from '@react-email/render';

import { Resend } from 'resend';
import WelcomeEmail from '@polotrip/transactional/emails/welcome';
import { env } from '@/env';

class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async sendWelcomeEmail(name: string, email: string): Promise<void> {
    try {
      const emailContent = await render(React.createElement(WelcomeEmail, { name }));

      await this.resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [email],
        subject: 'Bem-vindo ao Polotrip!',
        html: emailContent,
      });
    } catch (error) {
      console.error('Error when sending welcome email:', error);
    }
  }
}

export const emailService = new EmailService();
