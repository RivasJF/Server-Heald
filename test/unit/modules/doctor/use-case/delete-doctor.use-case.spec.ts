import { NotFoundException } from '@nestjs/common';
import { Doctor } from '../../../../../src/doctor/entities/doctor.entity';
import { IDoctorRepository } from '../../../../../src/doctor/repositories/doctor.repository.imp';
import { DeleteDoctorUseCase } from '../../../../../src/doctor/use-cases/delete-doctor.use-case';

describe('DeleteDoctorUseCase', () => {
  let useCase: DeleteDoctorUseCase;
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

    useCase = new DeleteDoctorUseCase(doctorRepo);
  });

  it('elimina doctor existente y retorna dto', async () => {
    const deletedDoctor = Doctor.create(
      'user-1',
      'Cardiology',
      'Bio',
      'doctor-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:00:00.000Z'),
    );

    doctorRepo.delete.mockResolvedValue(deletedDoctor);

    const result = await useCase.execute('doctor-1');

    expect(doctorRepo.delete).toHaveBeenCalledWith('doctor-1');
    expect(result).toMatchObject({
      id: 'doctor-1',
      userId: 'user-1',
    });
  });

  it('lanza NotFoundException si no existe doctor', async () => {
    doctorRepo.delete.mockResolvedValue(null);

    await expect(useCase.execute('doctor-404')).rejects.toThrow(NotFoundException);
  });
});
