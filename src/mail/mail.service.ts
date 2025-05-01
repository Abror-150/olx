import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'testotpn16@gmail.com',
        pass: 'zyhe vmzp llzh tbhc',
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: 'urazalievv.abror@gmail.com',
        to,
        subject,
        text,
      });
      console.log('Email yuborildi:', info.messageId);
    } catch (error) {
      console.error('Email yuborishda xato:', error);
    }
  }
}
