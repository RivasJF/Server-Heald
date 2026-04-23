import { DoctorSchedule } from '../../../../src/schedule/entities/doctor-schedule.entity';
import { DoctorScheduleBreak } from '../../../../src/schedule/entities/doctor-schedule-break.entity';
import { DoctorScheduleDay } from '../../../../src/schedule/entities/doctor-schedule-day.entity';
import { Day } from '../../../../src/schedule/entities/day.enum';

describe('DoctorSchedule Entity', () => {
  it('crea un horario válido', () => {
    const days = [
      DoctorScheduleDay.create(Day.MON, '08:00', '12:00', 'day-1', 'schedule-1'),
    ];
    const breaks = [
      DoctorScheduleBreak.create(
        Day.MON,
        '10:00',
        '10:30',
        'break-1',
        'schedule-1',
      ),
    ];

    const schedule = DoctorSchedule.create(
      'doctor-1',
      30,
      days,
      breaks,
      'schedule-1',
      new Date('2026-04-20T08:00:00.000Z'),
      new Date('2026-04-20T08:30:00.000Z'),
    );

    expect(schedule.getDoctorId()).toBe('doctor-1');
    expect(schedule.getConsultationTime()).toBe(30);
    expect(schedule.getDays()).toHaveLength(1);
    expect(schedule.getBreaks()).toHaveLength(1);
  });

  it('lanza error si consultationTime es menor o igual a 0', () => {
    expect(() => DoctorSchedule.create('doctor-1', 0)).toThrow(
      'Consultation time must be greater than 0',
    );
  });

  it('actualiza consultationTime correctamente', () => {
    const schedule = DoctorSchedule.create('doctor-1', 20);

    schedule.updateConsultationTime(45);

    expect(schedule.getConsultationTime()).toBe(45);
  });
});
