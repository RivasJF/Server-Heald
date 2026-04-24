import { Clinic } from '../../../../../src/clinic/entities/clinic.entity';
import { IClinicRepository } from '../../../../../src/clinic/repository/clinic.repository.imp';
import { FindNearbyClinicUseCase } from '../../../../../src/clinic/use-case/find-nearby-clinic.use-case';

describe('FindNearbyClinicUseCase', () => {
  let useCase: FindNearbyClinicUseCase;
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

    useCase = new FindNearbyClinicUseCase(clinicRepository);
  });

  it('retorna clínicas ordenadas por distancia y dentro del radio', async () => {
    const near = Clinic.create(
      4.710989,
      -74.07209,
      'Cerca',
      'doctor-1',
      'clinic-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:00:00.000Z'),
    );

    const far = Clinic.create(
      6.25184,
      -75.56359,
      'Lejos',
      'doctor-2',
      'clinic-2',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:00:00.000Z'),
    );

    clinicRepository.findByCoordinatesRange.mockResolvedValue([near, far]);

    const result = await useCase.execute(4.710989, -74.07209, 5000);

    expect(clinicRepository.findByCoordinatesRange).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'clinic-1',
      address: 'Cerca',
    });
    expect(result[0].distance).toBe(0);
  });

  it('retorna arreglo vacío si no hay candidatas', async () => {
    clinicRepository.findByCoordinatesRange.mockResolvedValue([]);

    const result = await useCase.execute(4.7, -74.0, 5000);

    expect(result).toEqual([]);
  });
});
