import { Doctor } from '../../../../../src/doctor/entities/doctor.entity';
import { IDoctorRepository } from '../../../../../src/doctor/repositories/doctor.repository.imp';
import { GetAllDoctorUseCase } from '../../../../../src/doctor/use-cases/get-all-doctor.use-case';

describe('GetAllDoctorUseCase', () => {
  let useCase: GetAllDoctorUseCase;
  let doctorRepository: jest.Mocked<IDoctorRepository>;

  beforeEach(() => {
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

    useCase = new GetAllDoctorUseCase(doctorRepository);
  });

  it('retorna lista de doctores mapeada a dto', async () => {
    const createdAt = new Date('2026-04-20T10:00:00.000Z');
    const updatedAt = new Date('2026-04-20T10:30:00.000Z');

    const doctorOne = Doctor.create(
      'user-1',
      'Cardiology',
      'Especialista en cardiología',
      'doctor-1',
      createdAt,
      updatedAt,
    );

    const doctorTwo = Doctor.create(
      'user-2',
      'Pediatrics',
      'Especialista en pediatría',
      'doctor-2',
      createdAt,
      updatedAt,
    );

    doctorRepository.findMany.mockResolvedValue([doctorOne, doctorTwo]);

    const result = await useCase.execute();

    expect(doctorRepository.findMany).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: 'doctor-1',
      userId: 'user-1',
      speciality: 'Cardiology',
      biography: 'Especialista en cardiología',
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });

  it('retorna arreglo vacío cuando no hay doctores', async () => {
    doctorRepository.findMany.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
