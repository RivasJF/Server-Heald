import { BadRequestException } from '@nestjs/common';
import { UserCreateDto } from '../../../../../src/user/dto/userCreateRequest.dto';
import { Role } from '../../../../../src/user/entities/user.enum';
import { User } from '../../../../../src/user/entities/user.entity';
import { IUserRepository } from '../../../../../src/user/repositories/user.repository.imp';
import { CreateUserUseCase } from '../../../../../src/user/use-cases/create-user.use-case';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  const createDto: UserCreateDto = {
    name: 'Jonatan Rivas',
    email: 'jonatan@mail.com',
    password: '12345678',
    role: Role.CLIENT,
    phoneNumber: '+573001112233',
    birthDate: new Date('2000-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      fiendAllPagination: jest.fn(),
      fiendAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUserUseCase(userRepository);
  });

  it('crea un usuario cuando el correo no existe', async () => {
    const now = new Date('2026-04-15T10:00:00.000Z');
    const savedUser = User.create(
      createDto.name,
      createDto.email,
      createDto.password,
      createDto.role,
      createDto.phoneNumber,
      createDto.birthDate,
      'user-id-1',
      now,
      now,
    );

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.save.mockResolvedValue(savedUser);

    const result = await useCase.execute(createDto);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(createDto.email);
    expect(userRepository.save).toHaveBeenCalledTimes(1);

    const savedArg = userRepository.save.mock.calls[0][0];
    expect(savedArg.getName()).toBe(createDto.name);
    expect(savedArg.getEmail()).toBe(createDto.email);
    expect(savedArg.getRole()).toBe(createDto.role);

    expect(result).toEqual({
      id: 'user-id-1',
      name: createDto.name,
      email: createDto.email,
      phoneNumber: createDto.phoneNumber,
      birthDate: createDto.birthDate?.toISOString(),
      role: createDto.role,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  });

  it('lanza BadRequestException si el correo ya existe', async () => {
    const existingUser = User.create(
      'Existing User',
      createDto.email,
      'existing123',
      Role.CLIENT,
    );

    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(createDto)).rejects.toThrow(
      new BadRequestException('El correo es invalido o ya está en uso'),
    );

    expect(userRepository.save).not.toHaveBeenCalled();
  });
});