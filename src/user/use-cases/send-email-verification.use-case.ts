import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository.imp';
import { IVerificationRepository } from '../repositories/verification.repository.imp';
import { Verification } from '../entities/verification.entity';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { User } from '../entities/user.entity';
import { VerificationCreateRequestDto } from '../dto/verificationCreateRequest.dto';

@Injectable()
export class SendEmailVerificationUseCase {
  constructor(
    @Inject('IVerificationRepository')
    private readonly verificationRepository: IVerificationRepository,
    private readonly sendEmailService: EmailSenderService
  ) { }

  async execute(veridicationCreateRequestDto: VerificationCreateRequestDto): Promise<{ message: string }> {
    const email = veridicationCreateRequestDto.email;
    User.validateEmail(email);
    const verification = await this.verificationRepository.findByEmail(email);

    //verification exist and is verified
    if (verification && verification.getIsVerified()) {
      throw new BadRequestException('El correo es invalido o ya está en uso');
    }

    //verification exist and is not verified (resend)
    if (verification && verification.getIsVerified() == false) {
      try {
        verification.generateNewCode(Verification.generateCode());

        const updatedVerification = await this.verificationRepository.save(verification);

        await this.sendEmailService.sendEmail(
          email,
          'Verificación de cuenta',
          Verification.formatForEmail(updatedVerification.getCode()),
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al reenviar código';
        throw new BadRequestException(message);
      }
    }

    //verification not exist (first time)
    if (verification == null) {
      const code = Verification.generateCode();

      const verification = Verification.create(email, code);

      const newVerification = await this.verificationRepository.save(verification);

      this.sendEmailService.sendEmail(email, 'Verificación de cuenta', Verification.formatForEmail(newVerification.getCode()));
    }



    return { message: 'Correo de verificación enviado' };

  }
}