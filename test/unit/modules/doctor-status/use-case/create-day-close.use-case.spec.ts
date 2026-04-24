import { BadRequestException } from '@nestjs/common';
import { CreateDayCloseDto } from '../../../../../src/doctor-status/dto/create-day-close';
import { DoctorDayClose } from '../../../../../src/doctor-status/entities/doctor-day-close.entity';
import { IDoctorDayCloseRepository } from '../../../../../src/doctor-status/repository/doctor-day-close.repository.imp';
import { CreateDayCloseUseCase } from '../../../../../src/doctor-status/use-cases/create-day-close.use-case';

describe('CreateDayCloseUseCase', () => {
  let useCase: CreateDayCloseUseCase;
  let repository: jest.Mocked<IDoctorDayCloseRepository>;

  const dto: CreateDayCloseDto = {
    date: '2026-04-24',
    closedAt: '14:30',
  };

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findByDoctorIdAndDate: jest.fn(),
      deleteByDoctorIdAndDate: jest.fn(),
    };

    useCase = new CreateDayCloseUseCase(repository);
  });

  it('crea cierre anticipado cuando no existe uno previo', async () => {
    const createdAt = new Date('2026-04-20T10:00:00.000Z');
    const dayClose = DoctorDayClose.create(
      'doctor-1',
      new Date(dto.date),
      dto.closedAt,
      'close-1',
      createdAt,
    );

    repository.findByDoctorIdAndDate.mockResolvedValue(null);
    repository.save.mockResolvedValue(dayClose);

    const result = await useCase.execute('doctor-1', dto);

    expect(repository.findByDoctorIdAndDate).toHaveBeenCalledWith(
      'doctor-1',
      new Date(dto.date),
    );
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'close-1',
      doctorId: 'doctor-1',
      date: new Date(dto.date).toISOString(),
      closedAt: '14:30',
      createdAt: createdAt.toISOString(),
    });
  });

  it('lanza BadRequestException si ya existe cierre para esa fecha', async () => {
    repository.findByDoctorIdAndDate.mockResolvedValue(
      DoctorDayClose.create('doctor-1', new Date(dto.date), dto.closedAt),
    );

    await expect(useCase.execute('doctor-1', dto)).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });
});
