import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserMapper } from '../mapper/user.mapper';
import { IUserRepository } from '../repositories/user.repository.imp';

@Injectable()
export class GetAllUsersPaginationUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(number: number, pageSize: number) {
    const page = Number(number);

    if (!Number.isFinite(page) || page <= 0 && !Number.isFinite(pageSize) || pageSize <= 0) {
      throw new BadRequestException(
        'El parámetro page y pageSize deben ser números mayores a 0',
      );
    }

    const users = await this.userRepository.fiendAllPagination(page, pageSize);
    return users.map((user) => UserMapper.toDto(user));
  }
}
