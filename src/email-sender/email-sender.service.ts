import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSenderService {

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        // Implement your email sending logic here using your preferred email service provider (e.g., SendGrid, Amazon SES, etc.)
        console.log(`Sending email to: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
    }

}
