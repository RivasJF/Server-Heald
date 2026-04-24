import { Appointment } from '../../../../../src/appointment/entities/appointment.entity';
import { IAppointmentRepository } from '../../../../../src/appointment/repository/appointment.repository.imp';
import { FindAppointmentsByDoctorPaginationUseCase } from '../../../../../src/appointment/use-case/find-appointments-by-doctor-pagination.use-case';

describe('FindAppointmentsByDoctorPaginationUseCase', () => {
  let useCase: FindAppointmentsByDoctorPaginationUseCase;
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

    useCase = new FindAppointmentsByDoctorPaginationUseCase(appointmentRepository);
  });

  it('retorna citas paginadas del doctor', async () => {
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

    appointmentRepository.findByDoctorIdPagination.mockResolvedValue([appointment]);

    const result = await useCase.execute('doctor-1', 1, 10);

    expect(appointmentRepository.findByDoctorIdPagination).toHaveBeenCalledWith(
      'doctor-1',
      1,
      10,
    );
    expect(result).toHaveLength(1);
  });
});
