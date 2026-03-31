import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from 'src/user/repositories/user.repository.imp';
import { UserMapper } from 'src/user/mapper/user.mapper';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    return UserMapper.toDto(user);
  }
}
