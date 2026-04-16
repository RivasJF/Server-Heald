import { Doctor } from '../../../../src/doctor/entities/doctor.entity';
import { DoctorServiceStatus } from '../../../../src/doctor-status/entities/doctor-service-status.entity';

describe('Doctor Entity', () => {
  it('crea un doctor válido con campos opcionales vacíos', () => {
    const doctor = Doctor.create('doctor-user-id');

    expect(doctor.getUserId()).toBe('doctor-user-id');
    expect(doctor.getSpeciality()).toBeUndefined();
    expect(doctor.getBiography()).toBeUndefined();
    expect(doctor.getCreatedAt()).toBeUndefined();
    expect(doctor.getUpdatedAt()).toBeUndefined();
  });

  it('crea un doctor con datos opcionales y metadatos', () => {
    const createdAt = new Date('2026-01-10T10:00:00.000Z');
    const updatedAt = new Date('2026-01-11T10:00:00.000Z');

    const doctor = Doctor.create(
      'doctor-user-id',
      'Cardiology',
      'Especialista en cardiología clínica',
      'doctor-id-1',
      createdAt,
      updatedAt,
    );

    expect(doctor.getId()).toBe('doctor-id-1');
    expect(doctor.getUserId()).toBe('doctor-user-id');
    expect(doctor.getSpeciality()).toBe('Cardiology');
    expect(doctor.getBiography()).toBe('Especialista en cardiología clínica');
    expect(doctor.getCreatedAt()).toEqual(createdAt);
    expect(doctor.getUpdatedAt()).toEqual(updatedAt);
  });

  describe('updateData', () => {
    it('actualiza speciality y biography', () => {
      const doctor = Doctor.create('doctor-user-id', 'General', 'Bio inicial');

      doctor.updateData({
        speciality: 'Neurology',
        biography: 'Especialista en neurología',
      });

      expect(doctor.getSpeciality()).toBe('Neurology');
      expect(doctor.getBiography()).toBe('Especialista en neurología');
    });

    it('solo actualiza campos enviados', () => {
      const doctor = Doctor.create('doctor-user-id', 'General', 'Bio inicial');

      doctor.updateData({ speciality: 'Pediatrics' });

      expect(doctor.getSpeciality()).toBe('Pediatrics');
      expect(doctor.getBiography()).toBe('Bio inicial');
    });
  });

  describe('serviceIsActive', () => {
    it('retorna undefined cuando no existe serviceStatus', () => {
      const doctor = Doctor.create('doctor-user-id');

      expect(doctor.serviceIsActive()).toBeUndefined();
    });

    it('retorna true cuando el estado del servicio está activo', () => {
      const serviceStatus = DoctorServiceStatus.create('doctor-id-1', true);
      const doctor = Doctor.create(
        'doctor-user-id',
        'General',
        'Bio',
        'doctor-id-1',
        undefined,
        undefined,
        undefined,
        serviceStatus,
      );

      expect(doctor.serviceIsActive()).toBe(true);
    });

    it('retorna false cuando el estado del servicio está inactivo', () => {
      const serviceStatus = DoctorServiceStatus.create('doctor-id-1', false);
      const doctor = Doctor.create(
        'doctor-user-id',
        'General',
        'Bio',
        'doctor-id-1',
        undefined,
        undefined,
        undefined,
        serviceStatus,
      );

      expect(doctor.serviceIsActive()).toBe(false);
    });
  });
});
