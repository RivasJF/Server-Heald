import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CodeValidationRequestDto } from "../dto/codeValidationRequest.dto";
import { IPasswordResetRepository } from "../repositories/password-reset.respository.imp";

@Injectable()
export class ValidateCodePasswordResetUseCase {
  constructor(
    @Inject('IPasswordResetRepository')
    private readonly passwordResetRepository: IPasswordResetRepository,

  ) {}

  async execute(codeValidationRequestDto: CodeValidationRequestDto) {
    const { code, email } = codeValidationRequestDto;
    const passwordReset = await this.passwordResetRepository.findByEmail(email);
    if (!passwordReset) {
      throw new BadRequestException('El correo es invalido');
    }


    let IsValidCode: boolean;
    try {
      IsValidCode = passwordReset.validateCode(code);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Codigo de verificación ivalido';
      throw new BadRequestException(message);
    }

    if (!IsValidCode) {
      await this.passwordResetRepository.save(passwordReset);
      throw new BadRequestException('El código de verificación es incorrecto o inválido');
    }

    await this.passwordResetRepository.save(passwordReset);

    return { message: 'Validacion exitosa' };
  }
}