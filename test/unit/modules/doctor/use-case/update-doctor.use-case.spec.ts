import { NotFoundException } from '@nestjs/common';
import { UpdateDoctorDto } from '../../../../../src/doctor/dto/doctorUpdateRequest.dto';
import { Doctor } from '../../../../../src/doctor/entities/doctor.entity';
import { IDoctorRepository } from '../../../../../src/doctor/repositories/doctor.repository.imp';
import { UpdateDoctorUseCase } from '../../../../../src/doctor/use-cases/update-doctor.use-case';

describe('UpdateDoctorUseCase', () => {
  let useCase: UpdateDoctorUseCase;
  let doctorRepo: jest.Mocked<IDoctorRepository>;

  const updateDto: UpdateDoctorDto = {
    speciality: 'Neurology',
    biography: 'Especialista en neurología',
  };

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

    useCase = new UpdateDoctorUseCase(doctorRepo);
  });

  it('actualiza doctor existente', async () => {
    const existingDoctor = Doctor.create(
      'user-1',
      'Cardiology',
      'Bio inicial',
      'doctor-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:00:00.000Z'),
    );

    const savedDoctor = Doctor.create(
      'user-1',
      'Neurology',
      'Especialista en neurología',
      'doctor-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-21T10:00:00.000Z'),
    );

    doctorRepo.findById.mockResolvedValue(existingDoctor);
    doctorRepo.save.mockResolvedValue(savedDoctor);

    const result = await useCase.execute('doctor-1', updateDto);

    expect(doctorRepo.findById).toHaveBeenCalledWith('doctor-1');
    expect(doctorRepo.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'doctor-1',
      userId: 'user-1',
      speciality: 'Neurology',
      biography: 'Especialista en neurología',
    });
  });

  it('lanza NotFoundException cuando doctor no existe', async () => {
    doctorRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('doctor-404', updateDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(doctorRepo.save).not.toHaveBeenCalled();
  });
});
