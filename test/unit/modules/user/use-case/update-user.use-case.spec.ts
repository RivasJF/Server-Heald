import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../../../../../src/user/dto/userUpdateRequest.dto';
import { User } from '../../../../../src/user/entities/user.entity';
import { Role } from '../../../../../src/user/entities/user.enum';
import { IUserRepository } from '../../../../../src/user/repositories/user.repository.imp';
import { UpdateUserUseCase } from '../../../../../src/user/use-cases/update-user.use-case';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      fiendAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new UpdateUserUseCase(userRepository);
  });

  it('actualiza usuario cuando existe y correo no está en uso', async () => {
    const originalUser = User.create(
      'Ana Doe',
      'ana@mail.com',
      '12345678',
      Role.CLIENT,
      '+573001112233',
      new Date('1998-01-01T00:00:00.000Z'),
      'user-1',
    );

    const updateDto: UpdateUserDto = {
      name: 'Ana Updated',
      email: 'ANA.UPDATED@mail.com',
      password: 'newpass123',
      phoneNumber: '+573004445566',
    };

    userRepository.findById.mockResolvedValue(originalUser);
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.save.mockImplementation(async (user) => user);

    const result = await useCase.execute('user-1', updateDto);

    expect(userRepository.findById).toHaveBeenCalledWith('user-1');
    expect(userRepository.findByEmail).toHaveBeenCalledWith(updateDto.email);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'user-1',
      name: 'Ana Updated',
      email: 'ana.updated@mail.com',
      phoneNumber: '+573004445566',
      role: Role.CLIENT,
    });
  });

  it('lanza NotFoundException si usuario no existe', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id', {})).rejects.toThrow(
      new NotFoundException('Usuario con id missing-id no encontrado'),
    );

    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si nuevo correo ya está en uso por otro usuario', async () => {
    const currentUser = User.create(
      'Ana Doe',
      'ana@mail.com',
      '12345678',
      Role.CLIENT,
      undefined,
      undefined,
      'user-1',
    );
    const otherUser = User.create(
      'Other User',
      'other@mail.com',
      '87654321',
      Role.CLIENT,
      undefined,
      undefined,
      'user-2',
    );

    userRepository.findById.mockResolvedValue(currentUser);
    userRepository.findByEmail.mockResolvedValue(otherUser);

    await expect(
      useCase.execute('user-1', { email: 'other@mail.com' }),
    ).rejects.toThrow(
      new BadRequestException('El correo es invalido o ya está en uso'),
    );

    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
