import { User } from '../../../../../src/user/entities/user.entity';
import { Role } from '../../../../../src/user/entities/user.enum';
import { IUserRepository } from '../../../../../src/user/repositories/user.repository.imp';
import { GetAllUsersUseCase } from '../../../../../src/user/use-cases/get-all-users.use-case';

describe('GetAllUsersUseCase', () => {
  let useCase: GetAllUsersUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      fiendAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetAllUsersUseCase(userRepository);
  });

  it('retorna lista de usuarios mapeados a dto', async () => {
    const now = new Date('2026-04-15T12:00:00.000Z');
    const userOne = User.create(
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
    const userTwo = User.create(
      'Doc House',
      'doc@mail.com',
      '87654321',
      Role.DOCTOR,
      undefined,
      undefined,
      'user-2',
      now,
      now,
    );

    userRepository.fiendAll.mockResolvedValue([userOne, userTwo]);

    const result = await useCase.execute();

    expect(userRepository.fiendAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: 'user-1',
      name: 'Ana Doe',
      email: 'ana@mail.com',
      role: Role.CLIENT,
      phoneNumber: '+573001112233',
      birthDate: '1998-01-01T00:00:00.000Z',
    });
    expect(result[1]).toMatchObject({
      id: 'user-2',
      name: 'Doc House',
      email: 'doc@mail.com',
      role: Role.DOCTOR,
      phoneNumber: null,
      birthDate: null,
    });
  });

  it('retorna arreglo vacío cuando no hay usuarios', async () => {
    userRepository.fiendAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
