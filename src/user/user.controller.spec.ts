import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Role } from '../../generated/prisma';

describe('UserController', () => {
  let controller: UserController;

  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Juan Pérez',
    email: 'juan@test.com',
    role: Role.CLIENT,
  };

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create user', async () => {
      serviceMock.create.mockResolvedValue(mockUser);

      const dto = {
        name: 'Juan Pérez',
        email: 'juan@test.com',
        password: '123456',
        role: Role.CLIENT,
      };

      const result = await controller.create(dto);

      expect(serviceMock.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe(mockUser.id);
    });
  });

  describe('findAll()', () => {
    it('should return users', async () => {
      serviceMock.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();

      expect(result).toHaveLength(1);
    });
  });

  describe('findOne()', () => {
    it('should return one user', async () => {
      serviceMock.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(mockUser.id);

      expect(serviceMock.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(result.id).toBe(mockUser.id);
    });
  });

  describe('update()', () => {
    it('should update user', async () => {
      serviceMock.update.mockResolvedValue({
        ...mockUser,
        name: 'Nuevo Nombre',
      });

      const result = await controller.update(mockUser.id, {
        name: 'Nuevo Nombre',
      });

      expect(serviceMock.update).toHaveBeenCalled();
      expect(result.name).toBe('Nuevo Nombre');
    });
  });

  describe('remove()', () => {
    it('should delete user', async () => {
      serviceMock.remove.mockResolvedValue(mockUser);

      const result = await controller.remove(mockUser.id);

      expect(serviceMock.remove).toHaveBeenCalledWith(mockUser.id);
      expect(result.id).toBe(mockUser.id);
    });
  });
});
