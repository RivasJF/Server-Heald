import { NotFoundException } from '@nestjs/common';
import { Doctor } from '../../../../../src/doctor/entities/doctor.entity';
import { IDoctorRepository } from '../../../../../src/doctor/repositories/doctor.repository.imp';
import { Day } from '../../../../../src/schedule/entities/day.enum';
import { DoctorSchedule } from '../../../../../src/schedule/entities/doctor-schedule.entity';
import { DoctorScheduleBreak } from '../../../../../src/schedule/entities/doctor-schedule-break.entity';
import { DoctorScheduleDay } from '../../../../../src/schedule/entities/doctor-schedule-day.entity';
import { IScheduleRepository } from '../../../../../src/schedule/repositories/schedule.repository.imp';
import { CreateScheduleUseCase } from '../../../../../src/schedule/use-cases/create-schedule.use-case';

describe('CreateScheduleUseCase', () => {
  let useCase: CreateScheduleUseCase;
  let scheduleRepository: jest.Mocked<IScheduleRepository>;
  let doctorRepository: jest.Mocked<IDoctorRepository>;

  beforeEach(() => {
    scheduleRepository = {
      save: jest.fn(),
      findByDoctorId: jest.fn(),
      update: jest.fn(),
    };

    doctorRepository = {
      findById: jest.fn(),
      findByIdWithServiceStatus: jest.fn(),
      findByUserId: jest.fn(),
      findByUserIdWithUserAndServiceStatus: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      createStatus: jest.fn(),
    };

    useCase = new CreateScheduleUseCase(scheduleRepository, doctorRepository);
  });

  it('crea horario cuando doctor existe', async () => {
    doctorRepository.findById.mockResolvedValue(Doctor.create('user-1', undefined, undefined, 'doctor-1'));

    const savedSchedule = DoctorSchedule.create(
      'doctor-1',
      30,
      [DoctorScheduleDay.create(Day.MON, '08:00', '12:00', 'day-1', 'schedule-1')],
      [DoctorScheduleBreak.create(Day.MON, '10:00', '10:30', 'break-1', 'schedule-1')],
      'schedule-1',
      new Date('2026-04-24T08:00:00.000Z'),
      new Date('2026-04-24T08:30:00.000Z'),
    );

    scheduleRepository.save.mockResolvedValue(savedSchedule);

    const result = await useCase.execute('doctor-1', {
      consultationTime: 30,
      days: [{ day: 'MON', startTime: '08:00', endTime: '12:00' }],
      breaks: [{ day: 'MON', startTime: '10:00', endTime: '10:30' }],
    });

    expect(doctorRepository.findById).toHaveBeenCalledWith('doctor-1');
    expect(scheduleRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'schedule-1',
      doctorId: 'doctor-1',
      consultationTime: 30,
    });
  });

  it('lanza NotFoundException cuando doctor no existe', async () => {
    doctorRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('doctor-404', {
        consultationTime: 30,
        days: [{ day: 'MON', startTime: '08:00', endTime: '12:00' }],
        breaks: [],
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
