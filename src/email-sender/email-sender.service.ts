import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailSenderService {

    private readonly logger = new Logger(EmailSenderService.name);
    private readonly resend: Resend;

    constructor() {

        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            this.logger.error('RESEND_API_KEY not configured');
            throw new Error('Resend configuration is missing');
        }

        this.resend = new Resend(apiKey);
    }

    async sendEmail(to: string, subject: string, body: string ): Promise<void> {

        try {

            const html = `
                <h2>Verificación de cuenta</h2>
                <p>${body}</p>
                <p>Este código expira en 5 minutos.</p>
            `;

            // const response = await this.resend.emails.send({
            //     from: 'verification@rivascript.qzz.io',
            //     to,
            //     subject,
            //     html,
            // });
            this.logger.log(`Email sent to ${to} with subject "${subject}" and body "${body}"`);


        } catch (error) {

            this.logger.error('Failed to send email', error);

            throw new Error('Could not send email');
        }
    }
}
