import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from '../../../../../src/appointment/dto/create-appointment.dto';
import { Appointment } from '../../../../../src/appointment/entities/appointment.entity';
import { IAppointmentRepository } from '../../../../../src/appointment/repository/appointment.repository.imp';
import { CreateAppointmentUseCase } from '../../../../../src/appointment/use-case/create-appointment.use-case';
import { DoctorServiceStatus } from '../../../../../src/doctor-status/entities/doctor-service-status.entity';
import { Doctor } from '../../../../../src/doctor/entities/doctor.entity';
import { IDoctorRepository } from '../../../../../src/doctor/repositories/doctor.repository.imp';

describe('CreateAppointmentUseCase', () => {
  let useCase: CreateAppointmentUseCase;
  let appointmentRepository: jest.Mocked<IAppointmentRepository>;
  let doctorRepository: jest.Mocked<IDoctorRepository>;

  const dto: CreateAppointmentDto = {
    doctorId: 'doctor-1',
    patientId: 'patient-1',
    clinicLocationId: 'clinic-1',
    startTime: '2026-04-24T10:00:00.000Z',
    endTime: '2026-04-24T10:30:00.000Z',
  };

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

    useCase = new CreateAppointmentUseCase(appointmentRepository, doctorRepository);
  });

  it('crea cita cuando doctor está activo y sin solapamiento', async () => {
    const doctor = Doctor.create(
      'user-1',
      'Cardiology',
      'Bio',
      'doctor-1',
      undefined,
      undefined,
      undefined,
      DoctorServiceStatus.create('doctor-1', true),
    );

    const saved = Appointment.create(
      dto.doctorId,
      dto.patientId,
      dto.clinicLocationId,
      new Date(dto.startTime),
      new Date(dto.endTime),
      'appointment-1',
      new Date('2026-04-24T09:00:00.000Z'),
      new Date('2026-04-24T09:00:00.000Z'),
    );

    doctorRepository.findByIdWithServiceStatus.mockResolvedValue(doctor);
    appointmentRepository.findOverlapping.mockResolvedValue(null);
    appointmentRepository.save.mockResolvedValue(saved);

    const result = await useCase.execute(dto);

    expect(doctorRepository.findByIdWithServiceStatus).toHaveBeenCalledWith('doctor-1');
    expect(appointmentRepository.findOverlapping).toHaveBeenCalledTimes(1);
    expect(appointmentRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'appointment-1',
      doctorId: 'doctor-1',
      patientId: 'patient-1',
      clinicLocationId: 'clinic-1',
    });
  });

  it('lanza NotFoundException si doctor no existe', async () => {
    doctorRepository.findByIdWithServiceStatus.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
  });

  it('lanza BadRequestException si doctor está inactivo', async () => {
    const doctor = Doctor.create(
      'user-1',
      'Cardiology',
      'Bio',
      'doctor-1',
      undefined,
      undefined,
      undefined,
      DoctorServiceStatus.create('doctor-1', false),
    );

    doctorRepository.findByIdWithServiceStatus.mockResolvedValue(doctor);

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
  });

  it('lanza BadRequestException si ya existe cita solapada', async () => {
    const doctor = Doctor.create(
      'user-1',
      'Cardiology',
      'Bio',
      'doctor-1',
      undefined,
      undefined,
      undefined,
      DoctorServiceStatus.create('doctor-1', true),
    );

    doctorRepository.findByIdWithServiceStatus.mockResolvedValue(doctor);
    appointmentRepository.findOverlapping.mockResolvedValue({} as Appointment);

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
  });
});
