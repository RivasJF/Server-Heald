import { BadRequestException } from '@nestjs/common';
import { CreateDayOffDto } from '../../../../../src/doctor-status/dto/create-day-off.dto';
import { DoctorDayOff } from '../../../../../src/doctor-status/entities/doctor-day-off.entity';
import { IDoctorDayOffRepository } from '../../../../../src/doctor-status/repository/doctor-day-off.repository.imp';
import { CreateDayOffUseCase } from '../../../../../src/doctor-status/use-cases/create-day-off.use-case';

describe('CreateDayOffUseCase', () => {
  let useCase: CreateDayOffUseCase;
  let repository: jest.Mocked<IDoctorDayOffRepository>;

  const dto: CreateDayOffDto = {
    date: '2026-04-25',
  };

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findByDoctorId: jest.fn(),
      findByDoctorIdAndDate: jest.fn(),
      deleteByDoctorIdAndDate: jest.fn(),
    };

    useCase = new CreateDayOffUseCase(repository);
  });

  it('crea día libre cuando no existe uno previo', async () => {
    const createdAt = new Date('2026-04-20T11:00:00.000Z');
    const dayOff = DoctorDayOff.create(
      'doctor-1',
      new Date(dto.date),
      'off-1',
      createdAt,
    );

    repository.findByDoctorIdAndDate.mockResolvedValue(null);
    repository.save.mockResolvedValue(dayOff);

    const result = await useCase.execute('doctor-1', dto);

    expect(repository.findByDoctorIdAndDate).toHaveBeenCalledWith(
      'doctor-1',
      new Date(dto.date),
    );
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'off-1',
      doctorId: 'doctor-1',
      date: new Date(dto.date).toISOString(),
      createdAt: createdAt.toISOString(),
    });
  });

  it('lanza BadRequestException si ya existe día libre para la fecha', async () => {
    repository.findByDoctorIdAndDate.mockResolvedValue(
      DoctorDayOff.create('doctor-1', new Date(dto.date)),
    );

    await expect(useCase.execute('doctor-1', dto)).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });
});
