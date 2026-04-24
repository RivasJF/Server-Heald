import { NotFoundException } from '@nestjs/common';
import { DoctorServiceStatus } from '../../../../../src/doctor-status/entities/doctor-service-status.entity';
import { Doctor } from '../../../../../src/doctor/entities/doctor.entity';
import { IDoctorRepository } from '../../../../../src/doctor/repositories/doctor.repository.imp';
import { GetDoctorByUserIdUseCase } from '../../../../../src/doctor/use-cases/get-doctor-by-user-id.use-case';
import { Role } from '../../../../../src/user/entities/user.enum';
import { User } from '../../../../../src/user/entities/user.entity';

describe('GetDoctorByUserIdUseCase', () => {
  let useCase: GetDoctorByUserIdUseCase;
  let doctorRepo: jest.Mocked<IDoctorRepository>;

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

    useCase = new GetDoctorByUserIdUseCase(doctorRepo);
  });

  it('retorna doctor por userId con user y serviceStatus', async () => {
    const user = User.create(
      'Jonatan',
      'jonatan@mail.com',
      '123456',
      Role.DOCTOR,
      undefined,
      undefined,
      'user-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:00:00.000Z'),
    );

    const serviceStatus = DoctorServiceStatus.create(
      'doctor-1',
      true,
      'status-1',
      new Date('2026-04-20T10:00:00.000Z'),
    );

    const doctor = Doctor.create(
      'user-1',
      'Cardiology',
      'Bio',
      'doctor-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:00:00.000Z'),
      user,
      serviceStatus,
    );

    doctorRepo.findByUserIdWithUserAndServiceStatus.mockResolvedValue(doctor);

    const result = await useCase.execute('user-1');

    expect(doctorRepo.findByUserIdWithUserAndServiceStatus).toHaveBeenCalledWith(
      'user-1',
    );
    expect(result).toMatchObject({
      id: 'doctor-1',
      userId: 'user-1',
      user: {
        id: 'user-1',
        email: 'jonatan@mail.com',
      },
      serviceStatus: {
        id: 'status-1',
        doctorId: 'doctor-1',
        active: true,
      },
    });
  });

  it('lanza NotFoundException si no existe doctor para userId', async () => {
    doctorRepo.findByUserIdWithUserAndServiceStatus.mockResolvedValue(null);

    await expect(useCase.execute('user-404')).rejects.toThrow(NotFoundException);
  });
});
