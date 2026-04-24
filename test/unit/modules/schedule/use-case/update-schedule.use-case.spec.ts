import { NotFoundException } from '@nestjs/common';
import { Day } from '../../../../../src/schedule/entities/day.enum';
import { DoctorSchedule } from '../../../../../src/schedule/entities/doctor-schedule.entity';
import { DoctorScheduleBreak } from '../../../../../src/schedule/entities/doctor-schedule-break.entity';
import { DoctorScheduleDay } from '../../../../../src/schedule/entities/doctor-schedule-day.entity';
import { IScheduleRepository } from '../../../../../src/schedule/repositories/schedule.repository.imp';
import { UpdateScheduleUseCase } from '../../../../../src/schedule/use-cases/update-schedule.use-case';

describe('UpdateScheduleUseCase', () => {
  let useCase: UpdateScheduleUseCase;
  let scheduleRepository: jest.Mocked<IScheduleRepository>;

  beforeEach(() => {
    scheduleRepository = {
      save: jest.fn(),
      findByDoctorId: jest.fn(),
      update: jest.fn(),
    };

    useCase = new UpdateScheduleUseCase(scheduleRepository);
  });

  it('actualiza horario existente', async () => {
    const existing = DoctorSchedule.create(
      'doctor-1',
      20,
      [DoctorScheduleDay.create(Day.MON, '08:00', '12:00', 'day-1', 'schedule-1')],
      [DoctorScheduleBreak.create(Day.MON, '10:00', '10:30', 'break-1', 'schedule-1')],
      'schedule-1',
      new Date('2026-04-24T08:00:00.000Z'),
      new Date('2026-04-24T08:30:00.000Z'),
    );

    const updated = DoctorSchedule.create(
      'doctor-1',
      20,
      [DoctorScheduleDay.create(Day.TUE, '09:00', '13:00', 'day-2', 'schedule-1')],
      [DoctorScheduleBreak.create(Day.TUE, '11:00', '11:20', 'break-2', 'schedule-1')],
      'schedule-1',
      new Date('2026-04-24T08:00:00.000Z'),
      new Date('2026-04-25T08:30:00.000Z'),
    );

    scheduleRepository.findByDoctorId.mockResolvedValue(existing);
    scheduleRepository.update.mockResolvedValue(updated);

    const result = await useCase.execute('doctor-1', {
      days: [{ day: 'TUE', startTime: '09:00', endTime: '13:00' }],
      breaks: [{ day: 'TUE', startTime: '11:00', endTime: '11:20' }],
    });

    expect(scheduleRepository.findByDoctorId).toHaveBeenCalledWith('doctor-1');
    expect(scheduleRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'schedule-1',
      doctorId: 'doctor-1',
      days: [
        {
          day: 'TUE',
          startTime: '09:00',
          endTime: '13:00',
        },
      ],
    });
  });

  it('lanza NotFoundException cuando no existe horario', async () => {
    scheduleRepository.findByDoctorId.mockResolvedValue(null);

    await expect(useCase.execute('doctor-404', {})).rejects.toThrow(NotFoundException);
  });
});
