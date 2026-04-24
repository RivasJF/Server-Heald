import { Clinic } from '../../../../../src/clinic/entities/clinic.entity';
import { IClinicRepository } from '../../../../../src/clinic/repository/clinic.repository.imp';
import { FindNearbyClinicPaginationUseCase } from '../../../../../src/clinic/use-case/find-nearby-clinic-pagination.use-case';

describe('FindNearbyClinicPaginationUseCase', () => {
  let useCase: FindNearbyClinicPaginationUseCase;
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

    useCase = new FindNearbyClinicPaginationUseCase(clinicRepository);
  });

  it('usa búsqueda paginada y retorna clínicas cercanas', async () => {
    const clinic = Clinic.create(
      4.710989,
      -74.07209,
      'Cerca',
      'doctor-1',
      'clinic-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:00:00.000Z'),
    );

    clinicRepository.findByCoordinatesRangePagination.mockResolvedValue([clinic]);

    const result = await useCase.execute(4.710989, -74.07209, 5000, 1, 10);

    expect(clinicRepository.findByCoordinatesRangePagination).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'clinic-1',
      address: 'Cerca',
    });
  });
});
