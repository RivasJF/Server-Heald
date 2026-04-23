import { Clinic } from '../../../../src/clinic/entities/clinic.entity';

describe('Clinic Entity', () => {
  it('crea una clínica válida', () => {
    const clinic = Clinic.create(
      4.710989,
      -74.07209,
      'Calle 100 # 10-20',
      'doctor-1',
    );

    expect(clinic.getLatitude()).toBe(4.710989);
    expect(clinic.getLongitude()).toBe(-74.07209);
    expect(clinic.getAddress()).toBe('Calle 100 # 10-20');
    expect(clinic.getDoctorId()).toBe('doctor-1');
  });

  it('lanza error si la latitud es inválida', () => {
    expect(() =>
      Clinic.create(120, -74.07209, 'Calle 100 # 10-20', 'doctor-1'),
    ).toThrow('Latitude must be between -90 and 90');
  });

  it('actualiza los datos de ubicación', () => {
    const clinic = Clinic.create(
      4.710989,
      -74.07209,
      'Calle 100 # 10-20',
      'doctor-1',
    );

    clinic.updateData({
      latitude: 4.65,
      longitude: -74.1,
      address: 'Carrera 15 # 90-10',
    });

    expect(clinic.getLatitude()).toBe(4.65);
    expect(clinic.getLongitude()).toBe(-74.1);
    expect(clinic.getAddress()).toBe('Carrera 15 # 90-10');
  });
});
