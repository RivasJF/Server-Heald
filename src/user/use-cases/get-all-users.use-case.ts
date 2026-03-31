import { Inject, Injectable} from '@nestjs/common';
import { UserMapper} from '../mapper/mapper'
import { IUserRepository } from '../repositories/user.repository.imp';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute() {
    const doctors = await this.userRepository.fiendAll();
    return doctors.map((doctor) => UserMapper.toDto(doctor));
  }
}