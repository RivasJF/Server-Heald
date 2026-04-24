import { Appointment } from '../../../../../src/appointment/entities/appointment.entity';
import { IAppointmentRepository } from '../../../../../src/appointment/repository/appointment.repository.imp';
import { FindAppointmentsByDoctorUseCase } from '../../../../../src/appointment/use-case/find-appointments-by-doctor.use-case';

describe('FindAppointmentsByDoctorUseCase', () => {
  let useCase: FindAppointmentsByDoctorUseCase;
  let appointmentRepository: jest.Mocked<IAppointmentRepository>;

  beforeEach(() => {
    appointmentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      findByPatientId: jest.fn(),
      findByPatientIdPagination: jest.fn(),
      findByDoctorId: jest.fn(),
      findByDoctorIdPagination: jest.fn(),
      findByDoctorIdInRange: jest.fn(),
      findOverlapping: jest.fn(),
    };

    useCase = new FindAppointmentsByDoctorUseCase(appointmentRepository);
  });

  it('retorna citas del doctor mapeadas', async () => {
    const appointment = Appointment.create(
      'doctor-1',
      'patient-1',
      'clinic-1',
      new Date('2026-04-24T10:00:00.000Z'),
      new Date('2026-04-24T10:30:00.000Z'),
      'appointment-1',
      new Date('2026-04-24T09:00:00.000Z'),
      new Date('2026-04-24T09:00:00.000Z'),
    );

    appointmentRepository.findByDoctorId.mockResolvedValue([appointment]);

    const result = await useCase.execute('doctor-1');

    expect(appointmentRepository.findByDoctorId).toHaveBeenCalledWith('doctor-1');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'appointment-1',
      doctorId: 'doctor-1',
      patientId: 'patient-1',
    });
  });
});
