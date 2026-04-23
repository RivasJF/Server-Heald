import { NotFoundException } from '@nestjs/common';
import { Day } from '../../../../../src/schedule/entities/day.enum';
import { DoctorSchedule } from '../../../../../src/schedule/entities/doctor-schedule.entity';
import { DoctorScheduleBreak } from '../../../../../src/schedule/entities/doctor-schedule-break.entity';
import { DoctorScheduleDay } from '../../../../../src/schedule/entities/doctor-schedule-day.entity';
import { IScheduleRepository } from '../../../../../src/schedule/repositories/schedule.repository.imp';
import { GetScheduleByUserIdUseCase } from '../../../../../src/schedule/use-cases/get-schedule-by-user-id.use-case';

describe('GetScheduleByUserIdUseCase', () => {
  let useCase: GetScheduleByUserIdUseCase;
  let scheduleRepository: jest.Mocked<IScheduleRepository>;

  beforeEach(() => {
    scheduleRepository = {
      save: jest.fn(),
      findByDoctorId: jest.fn(),
      update: jest.fn(),
    };

    useCase = new GetScheduleByUserIdUseCase(scheduleRepository);
  });

  it('retorna horario mapeado a dto', async () => {
    const day = DoctorScheduleDay.create(
      Day.MON,
      '08:00',
      '12:00',
      'day-1',
      'schedule-1',
    );
    const breakEntity = DoctorScheduleBreak.create(
      Day.MON,
      '10:00',
      '10:30',
      'break-1',
      'schedule-1',
    );

    const createdAt = new Date('2026-04-20T08:00:00.000Z');
    const updatedAt = new Date('2026-04-20T08:30:00.000Z');

    const schedule = DoctorSchedule.create(
      'doctor-1',
      30,
      [day],
      [breakEntity],
      'schedule-1',
      createdAt,
      updatedAt,
    );

    scheduleRepository.findByDoctorId.mockResolvedValue(schedule);

    const result = await useCase.execute('doctor-1');

    expect(scheduleRepository.findByDoctorId).toHaveBeenCalledWith('doctor-1');
    expect(result).toMatchObject({
      id: 'schedule-1',
      doctorId: 'doctor-1',
      consultationTime: 30,
      days: [
        {
          id: 'day-1',
          scheduleId: 'schedule-1',
          day: Day.MON,
          startTime: '08:00',
          endTime: '12:00',
        },
      ],
      breaks: [
        {
          id: 'break-1',
          scheduleId: 'schedule-1',
          day: Day.MON,
          startTime: '10:00',
          endTime: '10:30',
        },
      ],
    });
  });

  it('lanza NotFoundException cuando no existe horario', async () => {
    scheduleRepository.findByDoctorId.mockResolvedValue(null);

    await expect(useCase.execute('doctor-1')).rejects.toThrow(NotFoundException);
  });
});
