import { Appointment } from '../../../../src/appointment/entities/appointment.entity';

describe('Appointment Entity', () => {
  it('crea una cita válida', () => {
    const startTime = new Date('2026-04-20T10:00:00.000Z');
    const endTime = new Date('2026-04-20T10:30:00.000Z');

    const appointment = Appointment.create(
      'doctor-1',
      'patient-1',
      'clinic-1',
      startTime,
      endTime,
    );

    expect(appointment.getDoctorId()).toBe('doctor-1');
    expect(appointment.getPatientId()).toBe('patient-1');
    expect(appointment.getClinicLocationId()).toBe('clinic-1');
    expect(appointment.getStartTime()).toEqual(startTime);
    expect(appointment.getEndTime()).toEqual(endTime);
  });

  it('lanza error si endTime es menor o igual a startTime', () => {
    const startTime = new Date('2026-04-20T10:00:00.000Z');
    const endTime = new Date('2026-04-20T09:30:00.000Z');

    expect(() =>
      Appointment.create('doctor-1', 'patient-1', 'clinic-1', startTime, endTime),
    ).toThrow('End time must be greater than start time');
  });

  it('actualiza startTime y endTime correctamente', () => {
    const appointment = Appointment.create(
      'doctor-1',
      'patient-1',
      'clinic-1',
      new Date('2026-04-20T10:00:00.000Z'),
      new Date('2026-04-20T10:30:00.000Z'),
    );

    appointment.updateData({
      startTime: new Date('2026-04-20T11:00:00.000Z'),
      endTime: new Date('2026-04-20T11:30:00.000Z'),
    });

    expect(appointment.getStartTime()).toEqual(new Date('2026-04-20T11:00:00.000Z'));
    expect(appointment.getEndTime()).toEqual(new Date('2026-04-20T11:30:00.000Z'));
  });
});
