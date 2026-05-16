import { BadRequestException } from '@nestjs/common';
import { UserCreateDto } from '../../../../../src/user/dto/userCreateRequest.dto';
import { Role } from '../../../../../src/user/entities/user.enum';
import { User } from '../../../../../src/user/entities/user.entity';
import { Verification } from '../../../../../src/user/entities/verification.entity';
import { IUserRepository } from '../../../../../src/user/repositories/user.repository.imp';
import { IVerificationRepository } from '../../../../../src/user/repositories/verification.repository.imp';
import { CreateUserUseCase } from '../../../../../src/user/use-cases/create-user.use-case';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let verificationRepository: jest.Mocked<IVerificationRepository>;

  const createDto: UserCreateDto = {
    name: 'Jonatan Rivas',
    email: 'jonatan@mail.com',
    password: '12345678',
    role: Role.CLIENT,
    phoneNumber: '+573001112233',
    birthDate: new Date('2000-01-01T00:00:00.000Z'),
    code: '123456',
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

    verificationRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUserUseCase(userRepository, verificationRepository);
  });

  
  it('crea un usuario cuando el código de verificación es válido', async () => {
    const now = new Date();
    
    const verification = Verification.create(
      createDto.email,
      createDto.code,
      'verification-id-1',
      0,
      0,
      false,
      new Date(now.getTime() + 5 * 60 * 1000),
      now,
    );

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

    verificationRepository.findByEmail.mockResolvedValue(verification);
    userRepository.save.mockResolvedValue(savedUser);

    const result = await useCase.execute(createDto);

    expect(verificationRepository.findByEmail).toHaveBeenCalledWith(createDto.email);
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

  it('lanza BadRequestException si el correo ya está verificado', async () => {
    const verification = Verification.create(
      createDto.email,
      '123456',
      'verification-id-1',
      0,
      0,
      true, // isVerified = true
      new Date(),
      new Date(),
    );

    verificationRepository.findByEmail.mockResolvedValue(verification);

    await expect(useCase.execute(createDto)).rejects.toThrow(
      new BadRequestException('El correo es invalido o ya está en uso'),
    );

    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si el código de verificación es incorrecto', async () => {
    const now = new Date();
    
    const verification = Verification.create(
      createDto.email,
      '654321', // código diferente
      'verification-id-1',
      0,
      0,
      false,
      new Date(now.getTime() + 5 * 60 * 1000),
      now,
    );

    verificationRepository.findByEmail.mockResolvedValue(verification);
    verificationRepository.save.mockResolvedValue(verification);

    await expect(useCase.execute(createDto)).rejects.toThrow(
      new BadRequestException('El código de verificación es incorrecto o inválido'),
    );

    expect(userRepository.save).not.toHaveBeenCalled();
    expect(verificationRepository.save).toHaveBeenCalledTimes(1);
  });

  it('lanza BadRequestException si se excede el numero de intentos al validar el código', async () => {
    const now = new Date();

    const verification = Verification.create(
      createDto.email,
      '111111',
      'verification-id-1',
      3, // attempts at max to force incrementAttempts to throw
      0,
      false,
      new Date(now.getTime() + 5 * 60 * 1000),
      now,
    );

    verificationRepository.findByEmail.mockResolvedValue(verification);

    await expect(useCase.execute(createDto)).rejects.toThrow(
      new BadRequestException('Exedio el numero de intentos permitidos'),
    );

    expect(userRepository.save).not.toHaveBeenCalled();
    expect(verificationRepository.save).not.toHaveBeenCalled();
  });
});