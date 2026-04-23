import { NotFoundException } from '@nestjs/common';
import { DoctorDayOff } from '../../../../../src/doctor-status/entities/doctor-day-off.entity';
import { IDoctorDayOffRepository } from '../../../../../src/doctor-status/repository/doctor-day-off.repository.imp';
import { GetAllDayOffsUseCase } from '../../../../../src/doctor-status/use-cases/get-all-day-offs.use-case';

describe('GetAllDayOffsUseCase', () => {
  let useCase: GetAllDayOffsUseCase;
  let dayOffRepository: jest.Mocked<IDoctorDayOffRepository>;

  beforeEach(() => {
    dayOffRepository = {
      save: jest.fn(),
      findByDoctorId: jest.fn(),
      findByDoctorIdAndDate: jest.fn(),
      deleteByDoctorIdAndDate: jest.fn(),
    };

    useCase = new GetAllDayOffsUseCase(dayOffRepository);
  });

  it('retorna lista de días libres mapeada a dto', async () => {
    const createdAt = new Date('2026-04-20T12:00:00.000Z');
    const dayOffDate = new Date('2026-04-25T00:00:00.000Z');

    const dayOff = DoctorDayOff.create(
      'doctor-1',
      dayOffDate,
      'dayoff-1',
      createdAt,
    );

    dayOffRepository.findByDoctorId.mockResolvedValue([dayOff]);

    const result = await useCase.execute('doctor-1');

    expect(dayOffRepository.findByDoctorId).toHaveBeenCalledWith('doctor-1');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'dayoff-1',
      doctorId: 'doctor-1',
      date: dayOffDate.toISOString(),
      createdAt: createdAt.toISOString(),
    });
  });

  it('lanza NotFoundException cuando no hay días libres', async () => {
    dayOffRepository.findByDoctorId.mockResolvedValue([]);

    await expect(useCase.execute('doctor-1')).rejects.toThrow(NotFoundException);
  });
});
