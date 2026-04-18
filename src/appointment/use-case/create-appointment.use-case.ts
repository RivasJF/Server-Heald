import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { AppointmentResponseDto } from '../dto/appointmentResponse.dto';
import { AppointmentMapper } from '../mapper/appointment.mapper';
import { IAppointmentRepository } from '../repository/appointment.repository.imp';
import { IDoctorRepository } from 'src/doctor/repositories/doctor.repository.imp';
import { Appointment } from '../entities/appointment.entity';

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    @Inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject('IDoctorRepository')
    private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(dto: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (end <= start) {
      throw new BadRequestException(
        'endTime debe ser mayor que startTime',
      );
    }

    const doctor = await this.doctorRepository.findByIdWithServiceStatus(
      dto.doctorId,
    );
    if (!doctor) {
      throw new NotFoundException(
        `Doctor con id ${dto.doctorId} no encontrado`,
      );
    }

    if (!doctor.serviceIsActive()) {
      throw new BadRequestException(
        'El doctor tiene su servicio desactivado',
      );
    }

    // Check for overlapping appointments
    const overlapping = await this.appointmentRepository.findOverlapping(
      dto.doctorId,
      dto.clinicLocationId,
      start,
      end,
    );

    if (overlapping) {
      throw new BadRequestException(
        'El horario ya está ocupado',
      );
    }

    // Create appointment entity
    const appointment = Appointment.create(
      dto.doctorId,
      dto.patientId,
      dto.clinicLocationId,
      start,
      end,
    );

    // Save to repository
    const savedAppointment = await this.appointmentRepository.save(
      appointment,
    );

    return AppointmentMapper.toDto(savedAppointment);
  }
}
