import { BadRequestException } from '@nestjs/common';
import { Verification } from '../../../../../src/user/entities/verification.entity';
import { IVerificationRepository } from '../../../../../src/user/repositories/verification.repository.imp';
import { EmailSenderService } from '../../../../../src/email-sender/email-sender.service';
import { SendEmailVerificationUseCase } from '../../../../../src/user/use-cases/send-email-verification.use-case';

describe('SendEmailVerificationUseCase', () => {
  let useCase: SendEmailVerificationUseCase;
  let verificationRepository: jest.Mocked<IVerificationRepository>;
  let emailSenderService: jest.Mocked<EmailSenderService>;

  const email = 'test@mail.com';

  beforeEach(() => {
    verificationRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    };

    emailSenderService = {
      sendEmail: jest.fn(),
    } as any;

    useCase = new SendEmailVerificationUseCase(
      verificationRepository,
      emailSenderService,
    );
  });

  it('lanza BadRequestException si el correo ya está verificado', async () => {
    const verification = Verification.create(
      email,
      '123456',
      'verification-id-1',
      0,
      0,
      true, // isVerified = true
      new Date(),
      new Date(),
    );

    verificationRepository.findByEmail.mockResolvedValue(verification);

    await expect(useCase.execute({ email })).rejects.toThrow(
      new BadRequestException('El correo es invalido o ya está en uso'),
    );

    expect(emailSenderService.sendEmail).not.toHaveBeenCalled();
  });

  it('reenvía un código sin cooldown cuando hay intentos disponibles', async () => {
    const now = new Date();
    const oldCode = '123456';
    const newCode = '654321';

    const verification = Verification.create(
      email,
      oldCode,
      'verification-id-1',
      0,
      0, // resendAttempts = 0 (aún hay intentos disponibles)
      false,
      new Date(now.getTime() + 5 * 60 * 1000),
      now, // lastResendAt = now (cooldown NO importa porque aún hay intentos)
    );

    const updatedVerification = Verification.create(
      email,
      newCode,
      'verification-id-1',
      0,
      1, // resendAttempts incrementado a 1
      false,
      new Date(now.getTime() + 5 * 60 * 1000),
      now,
    );

    verificationRepository.findByEmail.mockResolvedValue(verification);
    verificationRepository.save.mockResolvedValue(updatedVerification);

    const result = await useCase.execute({ email });

    expect(verificationRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(verificationRepository.save).toHaveBeenCalledTimes(1);
    expect(emailSenderService.sendEmail).toHaveBeenCalledWith(
      email,
      'Verificación de cuenta',
      Verification.formatForEmail(newCode),
    );

    expect(result).toEqual({ message: 'Correo de verificación enviado' });
  });

  it('lanza BadRequestException si el reenvío está en cooldown (intentos agotados)', async () => {
    const now = new Date();
    const oldCode = '123456';

    const verification = Verification.create(
      email,
      oldCode,
      'verification-id-1',
      0,
      3, // resendAttempts = MAX_RESEND_ATTEMPTS (agotados)
      false,
      new Date(now.getTime() + 5 * 60 * 1000),
      now, // lastResendAt = now -> cooldown no ha pasado
    );

    verificationRepository.findByEmail.mockResolvedValue(verification);

    await expect(useCase.execute({ email })).rejects.toThrow(
      new BadRequestException('Debe esperar antes de solicitar un nuevo código'),
    );

    expect(emailSenderService.sendEmail).not.toHaveBeenCalled();
    expect(verificationRepository.save).not.toHaveBeenCalled();
  });

  it('reenvía código y reinicia intentos cuando el cooldown pasó con intentos agotados', async () => {
    const now = new Date();
    const oldCode = '123456';
    const newCode = '654321';

    const verification = Verification.create(
      email,
      oldCode,
      'verification-id-1',
      0,
      3, // resendAttempts = MAX_RESEND_ATTEMPTS (agotados)
      false,
      new Date(now.getTime() + 5 * 60 * 1000),
      new Date(now.getTime() - 31 * 60 * 1000), // hace más de 30 min (cooldown pasó)
    );

    const updatedVerification = Verification.create(
      email,
      newCode,
      'verification-id-1',
      0,
      1, // resendAttempts reiniciado y luego incrementado a 1
      false,
      new Date(now.getTime() + 5 * 60 * 1000),
      now,
    );

    verificationRepository.findByEmail.mockResolvedValue(verification);
    verificationRepository.save.mockResolvedValue(updatedVerification);

    const result = await useCase.execute({ email });

    expect(verificationRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(verificationRepository.save).toHaveBeenCalledTimes(1);
    expect(emailSenderService.sendEmail).toHaveBeenCalledWith(
      email,
      'Verificación de cuenta',
      Verification.formatForEmail(newCode),
    );

    expect(result).toEqual({ message: 'Correo de verificación enviado' });
  });

  it('crea una nueva verificación y envía código cuando el correo no existe', async () => {
    const now = new Date();
    const code = '123456';

    const newVerification = Verification.create(
      email,
      code,
      'verification-id-1',
      0,
      0,
      false,
      new Date(now.getTime() + 5 * 60 * 1000),
      now,
    );

    verificationRepository.findByEmail.mockResolvedValue(null);
    verificationRepository.save.mockResolvedValue(newVerification);

    const result = await useCase.execute({ email });

    expect(verificationRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(verificationRepository.save).toHaveBeenCalledTimes(1);
    expect(emailSenderService.sendEmail).toHaveBeenCalledWith(
      email,
      'Verificación de cuenta',
      Verification.formatForEmail(code),
    );

    expect(result).toEqual({ message: 'Correo de verificación enviado' });
  });

  it('lanza error si el email es inválido', async () => {
    const invalidEmail = 'invalid-email';

    await expect(useCase.execute({ email: invalidEmail })).rejects.toThrow();

    expect(verificationRepository.findByEmail).not.toHaveBeenCalled();
  });
});
