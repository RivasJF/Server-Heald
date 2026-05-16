import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository.imp';
import { User } from '../entities/user.entity';
import { UserMapper } from '../mapper/user.mapper';
import { UserCreateDto } from '../dto/userCreateRequest.dto';
import { IVerificationRepository } from '../repositories/verification.repository.imp';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IVerificationRepository')
    private readonly verificationRepository: IVerificationRepository,
  ) {}
  async execute(createUserDto: UserCreateDto) {
    const existingUser = await this.verificationRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser && existingUser.getIsVerified()) {
      throw new BadRequestException('El correo es invalido o ya está en uso');
    }

    if (!existingUser) {
      throw new BadRequestException('El código de verificación es incorrecto');
    }

    let IsValidCode: boolean;
    try {
      IsValidCode = existingUser.validateCode(createUserDto.code);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de verificación';
      throw new BadRequestException(message);
    }

    if (!IsValidCode) {
      await this.verificationRepository.save(existingUser);
      throw new BadRequestException('El código de verificación es incorrecto o inválido');
    }

    const user = User.create(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
      createUserDto.role,
      createUserDto.phoneNumber,
      createUserDto.birthDate,
    );
    const newUser = await this.userRepository.save(user);
    return UserMapper.toDto(newUser);
  }
}
