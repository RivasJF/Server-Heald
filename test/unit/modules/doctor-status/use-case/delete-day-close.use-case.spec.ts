import { NotFoundException } from '@nestjs/common';
import { IDoctorDayCloseRepository } from '../../../../../src/doctor-status/repository/doctor-day-close.repository.imp';
import { DeleteDayCloseUseCase } from '../../../../../src/doctor-status/use-cases/delete-day-close.use-case';

describe('DeleteDayCloseUseCase', () => {
  let useCase: DeleteDayCloseUseCase;
  let repository: jest.Mocked<IDoctorDayCloseRepository>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findByDoctorIdAndDate: jest.fn(),
      deleteByDoctorIdAndDate: jest.fn(),
    };

    useCase = new DeleteDayCloseUseCase(repository);
  });

  it('elimina cierre anticipado existente', async () => {
    const date = '2026-04-24';
    repository.findByDoctorIdAndDate.mockResolvedValue({} as any);
    repository.deleteByDoctorIdAndDate.mockResolvedValue(1);

    const result = await useCase.execute('doctor-1', { date });

    expect(repository.findByDoctorIdAndDate).toHaveBeenCalledWith(
      'doctor-1',
      new Date(`${date}T00:00:00`),
    );
    expect(repository.deleteByDoctorIdAndDate).toHaveBeenCalledWith(
      'doctor-1',
      new Date(`${date}T00:00:00`),
    );
    expect(result).toEqual({
      message: 'El cierre anticipado ha sido eliminado exitosamente.',
    });
  });

  it('lanza NotFoundException si no existe cierre', async () => {
    repository.findByDoctorIdAndDate.mockResolvedValue(null);

    await expect(
      useCase.execute('doctor-1', { date: '2026-04-24' }),
    ).rejects.toThrow(NotFoundException);
  });
});
