import { NotFoundException } from '@nestjs/common';
import { CreateClinicDto } from '../../../../../src/clinic/dto/create-clinic.dto';
import { Clinic } from '../../../../../src/clinic/entities/clinic.entity';
import { IClinicRepository } from '../../../../../src/clinic/repository/clinic.repository.imp';
import { CreateClinicUseCase } from '../../../../../src/clinic/use-case/create-clinic.use-case';
import { Doctor } from '../../../../../src/doctor/entities/doctor.entity';
import { IDoctorRepository } from '../../../../../src/doctor/repositories/doctor.repository.imp';

describe('CreateClinicUseCase', () => {
  let useCase: CreateClinicUseCase;
  let clinicRepository: jest.Mocked<IClinicRepository>;
  let doctorRepository: jest.Mocked<IDoctorRepository>;

  const dto: CreateClinicDto = {
    latitude: 4.710989,
    longitude: -74.07209,
    address: 'Calle 100 # 10-20',
    doctorId: 'doctor-1',
  };

  beforeEach(() => {
    clinicRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findAllWithDoctorAndUserAndServiceStatus: jest.fn(),
      findByCoordinatesRange: jest.fn(),
      findByCoordinatesRangePagination: jest.fn(),
      findById: jest.fn(),
      findByDoctorId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    doctorRepository = {
      findById: jest.fn(),
      findByIdWithServiceStatus: jest.fn(),
      findByUserId: jest.fn(),
      findByUserIdWithUserAndServiceStatus: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      createStatus: jest.fn(),
    };

    useCase = new CreateClinicUseCase(clinicRepository, doctorRepository);
  });

  it('crea clínica cuando el doctor existe', async () => {
    const createdAt = new Date('2026-04-20T10:00:00.000Z');
    const updatedAt = new Date('2026-04-20T10:30:00.000Z');

    doctorRepository.findById.mockResolvedValue(Doctor.create('user-1', undefined, undefined, 'doctor-1'));
    clinicRepository.save.mockResolvedValue(
      Clinic.create(
        dto.latitude,
        dto.longitude,
        dto.address,
        dto.doctorId,
        'clinic-1',
        createdAt,
        updatedAt,
      ),
    );

    const result = await useCase.execute(dto);

    expect(doctorRepository.findById).toHaveBeenCalledWith('doctor-1');
    expect(clinicRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'clinic-1',
      doctorId: 'doctor-1',
      address: dto.address,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });

  it('lanza NotFoundException cuando doctor no existe', async () => {
    doctorRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    expect(clinicRepository.save).not.toHaveBeenCalled();
  });
});
