import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../../generated/prisma';

describe('UserService', () => {
  let service: UserService;

  const prismaMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Juan Pérez',
    email: 'juan@test.com',
    password: 'hashed-password',
    role: Role.CLIENT,
    phoneNumber: null,
    birthDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create a CLIENT user', async () => {
      const dto = {
        name: 'Juan Pérez',
        email: 'juan@test.com',
        password: '12345678',
        role: Role.CLIENT,
      };

      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await service.create(dto);

      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: dto,
          select: expect.objectContaining({
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            birthDate: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          }),
        }),
      );

      expect(result).toMatchObject({
        id: expect.any(String),
        email: dto.email,
        role: Role.CLIENT,
      });
    });
  });

  describe('findAll()', () => {
    it('should return users', async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(prismaMock.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a user by id', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(mockUser.id);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockUser.id },
          select: expect.any(Object),
        }),
      );

      expect(result.id).toBe(mockUser.id);
    });

    it('should throw error if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('update()', () => {
    it('should update user data', async () => {
      const updateDto = { name: 'Nuevo Nombre' };
      // Ensure the existence check passes
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.user.update.mockResolvedValue({ ...mockUser, ...updateDto });

      const result = await service.update(mockUser.id, updateDto);

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockUser.id },
          data: updateDto,
          select: expect.any(Object),
        }),
      );

      expect(result.name).toBe('Nuevo Nombre');
    });
  });

  describe('remove()', () => {
    it('should delete user', async () => {
      // Ensure the existence check passes
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove(mockUser.id);

      expect(prismaMock.user.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: mockUser.id }, select: expect.any(Object) }),
      );

      expect(result.id).toBe(mockUser.id);
    });
  });
});