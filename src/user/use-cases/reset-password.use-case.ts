import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IPasswordResetRepository } from "../repositories/password-reset.respository.imp";
import { IUserRepository } from "../repositories/user.repository.imp";
import { ResetPasswordDto } from "../dto/resetPasswordRequest.dto";

@Injectable()
export class ResetPasswordUseCase {
    constructor(
        @Inject('IPasswordResetRepository')
        private readonly passwordResetRepository: IPasswordResetRepository,
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(resetPasswordDto: ResetPasswordDto) {
        const { email, newPassword } = resetPasswordDto;
        const passwordReset = await this.passwordResetRepository.findByEmail(email);
        if (!passwordReset) {
            throw new BadRequestException('El correo es invalido');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new BadRequestException('Usuario no encontrado');
        }

        if (!passwordReset.getVerified()) {
            throw new BadRequestException('El código de verificación no ha sido validado');
        }

        user.resetPassword(newPassword);
        await this.userRepository.save(user);

        passwordReset.invalidate();
        await this.passwordResetRepository.save(passwordReset);


        return { message: 'Contraseña restablecida exitosamente' };
    }
}