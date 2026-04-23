import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserMapper } from '../mapper/user.mapper';
import { IUserRepository } from '../repositories/user.repository.imp';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute() {
    const users = await this.userRepository.fiendAll();
    return users.map((user) => UserMapper.toDto(user));
  }
}
