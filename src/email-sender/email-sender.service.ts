import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailSenderService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailSenderService.name);
    private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor() {
        this.initializeTransporter();
    }

    private initializeTransporter(): void {
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (!emailUser || !emailPass) {
            this.logger.error('EMAIL_USER or EMAIL_PASS not configured');
            throw new Error('Email configuration is missing');
        }

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });
    }
    
    async sendEmail(to: string, subject: string, body: string): Promise<void> {

        const html = `
            <h2>Verificación de cuenta</h2>
            <p>${body}</p>
            <p>Este código expira en 5 minutos.</p>
        `;

        await this.transporter.sendMail({
            from: `"Server Heald" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
    }
}
