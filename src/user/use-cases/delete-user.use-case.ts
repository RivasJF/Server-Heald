import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserMapper } from '../mapper/user.mapper';
import { IUserRepository } from '../repositories/user.repository.imp';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const deletedUser = await this.userRepository.delete(id);
    if (!deletedUser) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return UserMapper.toDto(deletedUser);
  }
}
