import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../../../src/prisma/prisma.service';
import { DoctorServiceStatus } from '../../../../../src/doctor-status/entities/doctor-service-status.entity';
import { IDoctorServiceStatusRepository } from '../../../../../src/doctor-status/repository/doctor-service-status.repository.imp';
import { SetServiceStatusUseCase } from '../../../../../src/doctor-status/use-cases/set-service-status.use-case';

describe('SetServiceStatusUseCase', () => {
  let useCase: SetServiceStatusUseCase;
  let prisma: PrismaService;
  let clinicLocationFindUniqueMock: jest.Mock;
  let doctorScheduleFindUniqueMock: jest.Mock;
  let repository: jest.Mocked<IDoctorServiceStatusRepository>;

  beforeEach(() => {
    clinicLocationFindUniqueMock = jest.fn();
    doctorScheduleFindUniqueMock = jest.fn();

    prisma = {
      clinicLocation: {
        findUnique: clinicLocationFindUniqueMock,
      },
      doctorSchedule: {
        findUnique: doctorScheduleFindUniqueMock,
      },
    } as any;

    repository = {
      save: jest.fn(),
      findByDoctorId: jest.fn(),
    };

    useCase = new SetServiceStatusUseCase(prisma, repository);
  });

  it('crea estado cuando no existe', async () => {
    clinicLocationFindUniqueMock.mockResolvedValue({ id: 'clinic-1' } as any);
    doctorScheduleFindUniqueMock.mockResolvedValue({ id: 'schedule-1' } as any);

    repository.findByDoctorId.mockResolvedValue(null);
    repository.save.mockResolvedValue(
      DoctorServiceStatus.create('doctor-1', true, 'status-1'),
    );

    const result = await useCase.execute('doctor-1', { active: true });

    expect(repository.findByDoctorId).toHaveBeenCalledWith('doctor-1');
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'status-1',
      doctorId: 'doctor-1',
      active: true,
    });
  });

  it('lanza BadRequestException si activa y no tiene clínica', async () => {
    clinicLocationFindUniqueMock.mockResolvedValue(null);

    await expect(useCase.execute('doctor-1', { active: true })).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.findByDoctorId).not.toHaveBeenCalled();
  });

  it('actualiza estado existente a inactivo', async () => {
    const status = DoctorServiceStatus.create('doctor-1', true, 'status-1');
    repository.findByDoctorId.mockResolvedValue(status);
    repository.save.mockResolvedValue(status);

    const result = await useCase.execute('doctor-1', { active: false });

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'status-1',
      doctorId: 'doctor-1',
      active: false,
    });
  });
});
