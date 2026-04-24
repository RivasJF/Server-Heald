import { NotFoundException } from '@nestjs/common';
import { Clinic } from '../../../../../src/clinic/entities/clinic.entity';
import { IClinicRepository } from '../../../../../src/clinic/repository/clinic.repository.imp';
import { FindOneClinicUseCase } from '../../../../../src/clinic/use-case/find-one-clinic.use-case';

describe('FindOneClinicUseCase', () => {
  let useCase: FindOneClinicUseCase;
  let clinicRepository: jest.Mocked<IClinicRepository>;

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

    useCase = new FindOneClinicUseCase(clinicRepository);
  });

  it('retorna clínica por doctorId', async () => {
    const clinic = Clinic.create(
      4.710989,
      -74.07209,
      'Calle 100 # 10-20',
      'doctor-1',
      'clinic-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:00:00.000Z'),
    );

    clinicRepository.findByDoctorId.mockResolvedValue(clinic);

    const result = await useCase.execute('doctor-1');

    expect(clinicRepository.findByDoctorId).toHaveBeenCalledWith('doctor-1');
    expect(result).toMatchObject({
      id: 'clinic-1',
      doctorId: 'doctor-1',
    });
  });

  it('lanza NotFoundException cuando no existe clínica', async () => {
    clinicRepository.findByDoctorId.mockResolvedValue(null);

    await expect(useCase.execute('doctor-404')).rejects.toThrow(NotFoundException);
  });
});
