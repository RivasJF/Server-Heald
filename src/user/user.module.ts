import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/implementation/user.repository';
import { GetAllUsersUseCase } from './use-cases/get-all-users.use-case';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { GetUserByIdUseCase } from './use-cases/get-user-by-id.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { GetAllUsersPaginationUseCase } from './use-cases/get-all-uses-pagination.use-case';
import { VerificationRepository } from './repositories/implementation/verification.repository';
import { SendEmailVerificationUseCase } from './use-cases/send-email-verification.use-case';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';
import { PasswordResetRepository } from './repositories/implementation/password-reset.repository';
import { SendEmailPasswordResetUseCase } from './use-cases/send-email-password-reset.use-case';
import { ValidateCodePasswordResetUseCase } from './use-cases/validate-code-reset-password.use-case';
import { ResetPasswordUseCase } from './use-cases/reset-password.use-case';

@Module({
  imports: [EmailSenderModule],
  controllers: [UserController],
  providers: [
    GetAllUsersUseCase,
    GetAllUsersPaginationUseCase,
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    SendEmailVerificationUseCase,
    SendEmailPasswordResetUseCase,
    ValidateCodePasswordResetUseCase,
    ResetPasswordUseCase, 
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IVerificationRepository',
      useClass: VerificationRepository,
    },
    {
      provide: 'IPasswordResetRepository',
      useClass: PasswordResetRepository,
    }
  ],
  exports: ['IUserRepository'],
})
export class UserModule {}
