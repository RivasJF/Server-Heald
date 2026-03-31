import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository.imp';
import { User } from '../entities/user.entity';
import { UserMapper } from '../mapper/mapper';
import { UserCreateDto } from '../dto/userCreateRequest.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(createUserDto: UserCreateDto) {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('El correo es invalido o ya está en uso');
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
