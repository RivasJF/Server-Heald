import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from 'src/user/repositories/user.repository.imp';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { AuthRequest } from '../interfaces/auth-request.interface';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(req: AuthRequest) {
    const user = await this.userRepository.findById(req.user.id);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${req.user.id} no encontrado`);
    }

    return UserMapper.toDto(user);
  }
}
