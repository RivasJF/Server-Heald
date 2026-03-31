import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserMapper } from '../mapper/mapper';
import { IUserRepository } from '../repositories/user.repository.imp';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return UserMapper.toDto(user);
  }
}
