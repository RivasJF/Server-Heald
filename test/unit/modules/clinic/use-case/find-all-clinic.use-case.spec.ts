import { Clinic } from '../../../../../src/clinic/entities/clinic.entity';
import { IClinicRepository } from '../../../../../src/clinic/repository/clinic.repository.imp';
import { FindAllClinicUseCase } from '../../../../../src/clinic/use-case/find-all-clinic.use-case';

describe('FindAllClinicUseCase', () => {
  let useCase: FindAllClinicUseCase;
  let clinicRepository: jest.Mocked<IClinicRepository>;

  beforeEach(() => {
    clinicRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findAllWithDoctorAndUserAndServiceStatus: jest.fn(),
      findByCoordinatesRange: jest.fn(),
      findById: jest.fn(),
      findByDoctorId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindAllClinicUseCase(clinicRepository);
  });

  it('retorna lista de clínicas mapeada a dto', async () => {
    const createdAt = new Date('2026-04-20T12:00:00.000Z');
    const updatedAt = new Date('2026-04-20T12:30:00.000Z');

    const clinic = Clinic.create(
      4.710989,
      -74.07209,
      'Calle 100 # 10-20',
      'doctor-1',
      'clinic-1',
      createdAt,
      updatedAt,
    );

    clinicRepository.findAll.mockResolvedValue([clinic]);

    const result = await useCase.execute();

    expect(clinicRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'clinic-1',
      doctorId: 'doctor-1',
      address: 'Calle 100 # 10-20',
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });

  it('retorna arreglo vacío cuando no hay clínicas', async () => {
    clinicRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
