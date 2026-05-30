import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "../repositories/user.repository.imp";
import { IPasswordResetRepository } from "../repositories/password-reset.respository.imp";
import { User } from "../entities/user.entity";
import { PasswordReset } from "../entities/passrod-reset";
import { EmailSenderService } from "src/email-sender/email-sender.service";
import { VerificationCreateRequestDto } from "../dto/verificationCreateRequest.dto";

@Injectable()
export class SendEmailPasswordResetUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordResetRepository')
    private readonly passwordResetRepository: IPasswordResetRepository,
    private readonly sendEmailService: EmailSenderService
  ) {}

  async execute(verificationCreateRequestDto: VerificationCreateRequestDto) {
    const { email } = verificationCreateRequestDto;
    User.validateEmail(email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('El correo es invalido');
    }
    const existingPasswordReset = await this.passwordResetRepository.findByEmail(email);
    if (existingPasswordReset) {
      await this.passwordResetRepository.deleteById(existingPasswordReset.getId());
    }

    const newCode = PasswordReset.generateCode();
    const passwordReset = PasswordReset.create(email,newCode);
    await this.passwordResetRepository.save(passwordReset);

    this.sendEmailService.sendEmail(email, 'Restablecimiento de contraseña', PasswordReset.formatForEmail(newCode));
    
    return { message: 'Correo de verificación enviado' };
  }
}