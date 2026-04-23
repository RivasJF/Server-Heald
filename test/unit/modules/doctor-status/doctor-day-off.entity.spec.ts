import { DoctorDayOff } from '../../../../src/doctor-status/entities/doctor-day-off.entity';

describe('DoctorDayOff Entity', () => {
  it('crea un día libre válido', () => {
    const date = new Date('2026-04-25T00:00:00.000Z');

    const dayOff = DoctorDayOff.create('doctor-1', date);

    expect(dayOff.getDoctorId()).toBe('doctor-1');
    expect(dayOff.getDate()).toEqual(date);
    expect(dayOff.getId()).toBeUndefined();
  });

  it('lanza error si doctorId es vacío', () => {
    expect(() =>
      DoctorDayOff.create('', new Date('2026-04-25T00:00:00.000Z')),
    ).toThrow('Doctor id is required');
  });

  it('lanza error si la fecha es inválida', () => {
    expect(() =>
      DoctorDayOff.create('doctor-1', new Date('invalid')),
    ).toThrow('Date is invalid');
  });
});
