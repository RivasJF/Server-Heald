import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IClinicRepository } from '../../../../../src/clinic/repository/clinic.repository.imp';
import { DoctorDayClose } from '../../../../../src/doctor-status/entities/doctor-day-close.entity';
import { DoctorDayOff } from '../../../../../src/doctor-status/entities/doctor-day-off.entity';
import { IDoctorDayCloseRepository } from '../../../../../src/doctor-status/repository/doctor-day-close.repository.imp';
import { IDoctorDayOffRepository } from '../../../../../src/doctor-status/repository/doctor-day-off.repository.imp';
import { DoctorServiceStatus } from '../../../../../src/doctor-status/entities/doctor-service-status.entity';
import { Doctor } from '../../../../../src/doctor/entities/doctor.entity';
import { IDoctorRepository } from '../../../../../src/doctor/repositories/doctor.repository.imp';
import { Appointment } from '../../../../../src/appointment/entities/appointment.entity';
import { IAppointmentRepository } from '../../../../../src/appointment/repository/appointment.repository.imp';
import { GenerateAvailabilityUseCase } from '../../../../../src/appointment/use-case/generate-availability.use-case';
import { DoctorSchedule } from '../../../../../src/schedule/entities/doctor-schedule.entity';
import { IScheduleRepository } from '../../../../../src/schedule/repositories/schedule.repository.imp';

describe('GenerateAvailabilityUseCase', () => {
  let useCase: GenerateAvailabilityUseCase;
  let appointmentRepository: jest.Mocked<IAppointmentRepository>;
  let scheduleRepository: jest.Mocked<IScheduleRepository>;
  let doctorRepository: jest.Mocked<IDoctorRepository>;
  let doctorDayCloseRepository: jest.Mocked<IDoctorDayCloseRepository>;
  let doctorDayOffRepository: jest.Mocked<IDoctorDayOffRepository>;
  let clinicRepository: jest.Mocked<IClinicRepository>;

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

    scheduleRepository = {
      save: jest.fn(),
      findByDoctorId: jest.fn(),
      update: jest.fn(),
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

    doctorDayCloseRepository = {
      save: jest.fn(),
      findByDoctorIdAndDate: jest.fn(),
      deleteByDoctorIdAndDate: jest.fn(),
    };

    doctorDayOffRepository = {
      save: jest.fn(),
      findByDoctorId: jest.fn(),
      findByDoctorIdAndDate: jest.fn(),
      deleteByDoctorIdAndDate: jest.fn(),
    };

    clinicRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findAllWithDoctorAndUserAndServiceStatus: jest.fn(),
      findByCoordinatesRange: jest.fn(),
      findByCoordinatesRangePagination: jest.fn(),
      findById: jest.fn(),
      findByDoctorId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GenerateAvailabilityUseCase(
      appointmentRepository,
      scheduleRepository,
      doctorRepository,
      doctorDayCloseRepository,
      doctorDayOffRepository,
      clinicRepository,
    );
  });

  it('lanza NotFoundException cuando el doctor no existe', async () => {
    doctorRepository.findByIdWithServiceStatus.mockResolvedValue(null);

    await expect(useCase.execute('doctor-404', '2026-04-24')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('retorna disponibilidad vacía cuando el servicio del doctor está inactivo', async () => {
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

    const result = await useCase.execute('doctor-1', '2026-04-24');

    expect(result).toMatchObject({
      date: '2026-04-24',
      totalSlots: 0,
      availableSlots: 0,
      available: [],
      message: 'El doctor tiene su servicio desactivado',
    });
  });

  it('retorna mensaje de día libre cuando existe day off', async () => {
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
    scheduleRepository.findByDoctorId.mockResolvedValue(
      DoctorSchedule.create('doctor-1', 20, [], []),
    );
    doctorDayOffRepository.findByDoctorIdAndDate.mockResolvedValue(
      DoctorDayOff.create('doctor-1', new Date('2026-04-24T00:00:00.000Z')),
    );

    const result = await useCase.execute('doctor-1', '2026-04-24');

    expect(result).toMatchObject({
      date: '2026-04-24',
      totalSlots: 0,
      availableSlots: 0,
      available: [],
      message: 'El doctor no atenderá este día',
    });
  });

  it('lanza BadRequestException si fecha es inválida', async () => {
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

    await expect(useCase.execute('doctor-1', 'fecha-invalida')).rejects.toThrow(
      BadRequestException,
    );
  });
});
