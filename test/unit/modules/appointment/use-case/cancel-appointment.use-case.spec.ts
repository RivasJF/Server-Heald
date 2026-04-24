import { NotFoundException } from '@nestjs/common';
import { Appointment } from '../../../../../src/appointment/entities/appointment.entity';
import { IAppointmentRepository } from '../../../../../src/appointment/repository/appointment.repository.imp';
import { CancelAppointmentUseCase } from '../../../../../src/appointment/use-case/cancel-appointment.use-case';

describe('CancelAppointmentUseCase', () => {
  let useCase: CancelAppointmentUseCase;
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

    useCase = new CancelAppointmentUseCase(appointmentRepository);
  });

  it('cancela cita existente y retorna dto', async () => {
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

    appointmentRepository.findById.mockResolvedValue(appointment);
    appointmentRepository.delete.mockResolvedValue(appointment);

    const result = await useCase.execute('appointment-1');

    expect(appointmentRepository.findById).toHaveBeenCalledWith('appointment-1');
    expect(appointmentRepository.delete).toHaveBeenCalledWith('appointment-1');
    expect(result).toMatchObject({ id: 'appointment-1' });
  });

  it('lanza NotFoundException si la cita no existe', async () => {
    appointmentRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('appointment-404')).rejects.toThrow(NotFoundException);
  });
});
