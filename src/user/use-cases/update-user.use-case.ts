import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/userUpdateRequest.dto';
import { UserMapper } from '../mapper/user.mapper';
import { IUserRepository } from '../repositories/user.repository.imp';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.getEmail()) {
      const userWithEmail = await this.userRepository.findByEmail(updateUserDto.email);
      if (userWithEmail && userWithEmail.getId() !== id) {
        throw new BadRequestException('El correo es invalido o ya está en uso');
      }
    }

    existingUser.updateData({
      name: updateUserDto.name,
      email: updateUserDto.email,
      password: updateUserDto.password,
      phoneNumber: updateUserDto.phoneNumber
    });

    const updatedUser = await this.userRepository.save(existingUser);
    return UserMapper.toDto(updatedUser);
  }
}
