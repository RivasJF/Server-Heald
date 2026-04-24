import { NotFoundException } from '@nestjs/common';
import { UpdateClinicDto } from '../../../../../src/clinic/dto/update-clinic.dto';
import { Clinic } from '../../../../../src/clinic/entities/clinic.entity';
import { IClinicRepository } from '../../../../../src/clinic/repository/clinic.repository.imp';
import { UpdateClinicUseCase } from '../../../../../src/clinic/use-case/update-clinic.use-case';

describe('UpdateClinicUseCase', () => {
  let useCase: UpdateClinicUseCase;
  let clinicRepository: jest.Mocked<IClinicRepository>;

  const updateDto: UpdateClinicDto = {
    latitude: 4.65,
    longitude: -74.1,
    address: 'Carrera 15 # 90-10',
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

    useCase = new UpdateClinicUseCase(clinicRepository);
  });

  it('actualiza clínica existente', async () => {
    const existing = Clinic.create(
      4.710989,
      -74.07209,
      'Calle 100 # 10-20',
      'doctor-1',
      'clinic-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:00:00.000Z'),
    );

    const updated = Clinic.create(
      4.65,
      -74.1,
      'Carrera 15 # 90-10',
      'doctor-1',
      'clinic-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-21T10:00:00.000Z'),
    );

    clinicRepository.findById.mockResolvedValue(existing);
    clinicRepository.update.mockResolvedValue(updated);

    const result = await useCase.execute('clinic-1', updateDto);

    expect(clinicRepository.findById).toHaveBeenCalledWith('clinic-1');
    expect(clinicRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'clinic-1',
      address: 'Carrera 15 # 90-10',
    });
  });

  it('lanza NotFoundException cuando clínica no existe', async () => {
    clinicRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('clinic-404', updateDto)).rejects.toThrow(
      NotFoundException,
    );
  });
});
