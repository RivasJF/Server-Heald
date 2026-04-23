import { NotFoundException } from '@nestjs/common';
import { User } from '../../../../../src/user/entities/user.entity';
import { Role } from '../../../../../src/user/entities/user.enum';
import { IUserRepository } from '../../../../../src/user/repositories/user.repository.imp';
import { GetUserByIdUseCase } from '../../../../../src/user/use-cases/get-user-by-id.use-case';

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      fiendAllPagination: jest.fn(),
      fiendAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetUserByIdUseCase(userRepository);
  });

  it('retorna usuario mapeado cuando existe', async () => {
    const now = new Date('2026-04-15T12:00:00.000Z');
    const user = User.create(
      'Ana Doe',
      'ana@mail.com',
      '12345678',
      Role.CLIENT,
      '+573001112233',
      new Date('1998-01-01T00:00:00.000Z'),
      'user-1',
      now,
      now,
    );

    userRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute('user-1');

    expect(userRepository.findById).toHaveBeenCalledWith('user-1');
    expect(result).toMatchObject({
      id: 'user-1',
      name: 'Ana Doe',
      email: 'ana@mail.com',
      role: Role.CLIENT,
    });
  });

  it('lanza NotFoundException cuando no existe', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(
      new NotFoundException('Usuario con id missing-id no encontrado'),
    );
  });
});
