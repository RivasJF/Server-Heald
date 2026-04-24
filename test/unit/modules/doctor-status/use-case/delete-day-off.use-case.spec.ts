import { NotFoundException } from '@nestjs/common';
import { DoctorDayOff } from '../../../../../src/doctor-status/entities/doctor-day-off.entity';
import { IDoctorDayOffRepository } from '../../../../../src/doctor-status/repository/doctor-day-off.repository.imp';
import { DeleteDayOffUseCase } from '../../../../../src/doctor-status/use-cases/delete-day-off.use-case';

describe('DeleteDayOffUseCase', () => {
  let useCase: DeleteDayOffUseCase;
  let repository: jest.Mocked<IDoctorDayOffRepository>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findByDoctorId: jest.fn(),
      findByDoctorIdAndDate: jest.fn(),
      deleteByDoctorIdAndDate: jest.fn(),
    };

    useCase = new DeleteDayOffUseCase(repository);
  });

  it('elimina día libre existente', async () => {
    const date = '2026-04-25';
    repository.findByDoctorIdAndDate.mockResolvedValue(
      DoctorDayOff.create('doctor-1', new Date(date), 'off-1'),
    );
    repository.deleteByDoctorIdAndDate.mockResolvedValue(1);

    const result = await useCase.execute('doctor-1', date);

    expect(repository.findByDoctorIdAndDate).toHaveBeenCalledWith(
      'doctor-1',
      new Date(date),
    );
    expect(repository.deleteByDoctorIdAndDate).toHaveBeenCalledWith(
      'doctor-1',
      new Date(date),
    );
    expect(result).toEqual({
      message: 'El día libre ha sido eliminado exitosamente.',
    });
  });

  it('lanza NotFoundException si no existe día libre', async () => {
    repository.findByDoctorIdAndDate.mockResolvedValue(null);

    await expect(useCase.execute('doctor-1', '2026-04-25')).rejects.toThrow(
      NotFoundException,
    );
  });
});
