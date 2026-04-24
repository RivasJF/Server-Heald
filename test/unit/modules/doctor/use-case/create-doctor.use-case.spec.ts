import { NotFoundException } from '@nestjs/common';
import { DoctorServiceStatus } from '../../../../../src/doctor-status/entities/doctor-service-status.entity';
import { IDoctorServiceStatusRepository } from '../../../../../src/doctor-status/repository/doctor-service-status.repository.imp';
import { CreateDoctorDto } from '../../../../../src/doctor/dto/doctorCreateRequest.dto';
import { Doctor } from '../../../../../src/doctor/entities/doctor.entity';
import { IDoctorRepository } from '../../../../../src/doctor/repositories/doctor.repository.imp';
import { CreateDoctorUseCase } from '../../../../../src/doctor/use-cases/create-doctor.use-case';
import { Role } from '../../../../../src/user/entities/user.enum';
import { User } from '../../../../../src/user/entities/user.entity';
import { IUserRepository } from '../../../../../src/user/repositories/user.repository.imp';

describe('CreateDoctorUseCase', () => {
  let useCase: CreateDoctorUseCase;
  let doctorRepo: jest.Mocked<IDoctorRepository>;
  let userRepo: jest.Mocked<IUserRepository>;
  let doctorServiceStatusRepo: jest.Mocked<IDoctorServiceStatusRepository>;

  const createDto: CreateDoctorDto = {
    userId: 'user-1',
    speciality: 'Cardiology',
    biography: 'Especialista en cardiología',
  };

  beforeEach(() => {
    doctorRepo = {
      findById: jest.fn(),
      findByIdWithServiceStatus: jest.fn(),
      findByUserId: jest.fn(),
      findByUserIdWithUserAndServiceStatus: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      createStatus: jest.fn(),
    };

    userRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      fiendAllPagination: jest.fn(),
      fiendAll: jest.fn(),
      delete: jest.fn(),
    };

    doctorServiceStatusRepo = {
      save: jest.fn(),
      findByDoctorId: jest.fn(),
    };

    useCase = new CreateDoctorUseCase(
      doctorRepo,
      userRepo,
      doctorServiceStatusRepo,
    );
  });

  it('crea doctor y estado de servicio inactivo', async () => {
    const existingUser = User.create(
      'Jonatan',
      'jonatan@mail.com',
      '123456',
      Role.DOCTOR,
      undefined,
      undefined,
      'user-1',
    );

    const savedDoctor = Doctor.create(
      'user-1',
      'Cardiology',
      'Especialista en cardiología',
      'doctor-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:00:00.000Z'),
    );

    userRepo.findById.mockResolvedValue(existingUser);
    doctorRepo.save.mockResolvedValue(savedDoctor);
    doctorServiceStatusRepo.save.mockResolvedValue(
      DoctorServiceStatus.create('doctor-1', false, 'status-1'),
    );

    const result = await useCase.execute(createDto);

    expect(userRepo.findById).toHaveBeenCalledWith('user-1');
    expect(doctorRepo.save).toHaveBeenCalledTimes(1);
    expect(doctorServiceStatusRepo.save).toHaveBeenCalledTimes(1);

    const serviceStatusArg = doctorServiceStatusRepo.save.mock.calls[0][0];
    expect(serviceStatusArg.getDoctorId()).toBe('doctor-1');
    expect(serviceStatusArg.getActive()).toBe(false);

    expect(result).toMatchObject({
      id: 'doctor-1',
      userId: 'user-1',
      speciality: 'Cardiology',
      biography: 'Especialista en cardiología',
    });
  });

  it('lanza NotFoundException si el user no existe', async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(createDto)).rejects.toThrow(NotFoundException);
    expect(doctorRepo.save).not.toHaveBeenCalled();
    expect(doctorServiceStatusRepo.save).not.toHaveBeenCalled();
  });
});
