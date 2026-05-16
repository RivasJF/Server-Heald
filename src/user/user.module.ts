import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { GetAllUsersUseCase } from './use-cases/get-all-users.use-case';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { GetUserByIdUseCase } from './use-cases/get-user-by-id.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { GetAllUsersPaginationUseCase } from './use-cases/get-all-uses-pagination.use-case';
import { VerificationRepository } from './repositories/verification.repository';
import { SendEmailVerificationUseCase } from './use-cases/send-email-verification.use-case';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';

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
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IVerificationRepository',
      useClass: VerificationRepository,
    }
  ],
  exports: ['IUserRepository'],
})
export class UserModule {}
