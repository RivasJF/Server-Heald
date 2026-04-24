import { NotFoundException } from '@nestjs/common';
import { Doctor } from '../../../../../src/doctor/entities/doctor.entity';
import { IDoctorRepository } from '../../../../../src/doctor/repositories/doctor.repository.imp';
import { GetDoctorByIdUseCase } from '../../../../../src/doctor/use-cases/get-doctor-by-id.use-case';

describe('GetDoctorByIdUseCase', () => {
  let useCase: GetDoctorByIdUseCase;
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

    useCase = new GetDoctorByIdUseCase(doctorRepo);
  });

  it('retorna doctor por id', async () => {
    const doctor = Doctor.create(
      'user-1',
      'Cardiology',
      'Bio',
      'doctor-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:00:00.000Z'),
    );

    doctorRepo.findById.mockResolvedValue(doctor);

    const result = await useCase.execute('doctor-1');

    expect(doctorRepo.findById).toHaveBeenCalledWith('doctor-1');
    expect(result).toMatchObject({
      id: 'doctor-1',
      userId: 'user-1',
      speciality: 'Cardiology',
    });
  });

  it('lanza NotFoundException si no existe doctor', async () => {
    doctorRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('doctor-404')).rejects.toThrow(NotFoundException);
  });
});
