import { Appointment } from '../../../../../src/appointment/entities/appointment.entity';
import { IAppointmentRepository } from '../../../../../src/appointment/repository/appointment.repository.imp';
import { FindAppointmentsByPatientUseCase } from '../../../../../src/appointment/use-case/find-appointments-by-patient.use-case';

describe('FindAppointmentsByPatientUseCase', () => {
  let useCase: FindAppointmentsByPatientUseCase;
  let appointmentRepository: jest.Mocked<IAppointmentRepository>;

  beforeEach(() => {
    appointmentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      findByPatientId: jest.fn(),
      findByPatientIdPagination: jest.fn(),
      findByDoctorId: jest.fn(),
      findByDoctorIdInRange: jest.fn(),
      findOverlapping: jest.fn(),
      findByDoctorIdPagination: jest.fn(),
    };

    useCase = new FindAppointmentsByPatientUseCase(appointmentRepository);
  });

  it('retorna citas del paciente mapeadas a dto', async () => {
    const createdAt = new Date('2026-04-20T12:00:00.000Z');
    const updatedAt = new Date('2026-04-20T12:00:00.000Z');

    const appointment = Appointment.create(
      'doctor-1',
      'patient-1',
      'clinic-1',
      new Date('2026-04-21T10:00:00.000Z'),
      new Date('2026-04-21T10:30:00.000Z'),
      'appointment-1',
      createdAt,
      updatedAt,
    );

    appointmentRepository.findByPatientId.mockResolvedValue([appointment]);

    const result = await useCase.execute('patient-1');

    expect(appointmentRepository.findByPatientId).toHaveBeenCalledWith('patient-1');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'appointment-1',
      doctorId: 'doctor-1',
      patientId: 'patient-1',
      clinicLocationId: 'clinic-1',
    });
  });

  it('retorna arreglo vacío cuando no hay citas', async () => {
    appointmentRepository.findByPatientId.mockResolvedValue([]);

    const result = await useCase.execute('patient-1');

    expect(result).toEqual([]);
  });
});
