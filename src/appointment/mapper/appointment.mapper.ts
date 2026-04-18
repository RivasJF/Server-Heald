import { Doctor } from 'src/doctor/entities/doctor.entity';
import { AppointmentResponseDto } from '../dto/appointmentResponse.dto';
import { Appointment } from '../entities/appointment.entity';
import { DoctorMapper } from 'src/doctor/mapper/doctor.mapper';
import { ClinicMapper } from 'src/clinic/mapper/clinic.mapper';
import { AppointmentPatientResponseDto } from '../dto/appointment-patientResponse.dto';
import { AppointmentDoctorResponseDto } from '../dto/appintment-doctorResponse.dto';
import { UserMapper } from 'src/user/mapper/user.mapper';

export class AppointmentMapper {
  static toDto(appointment: Appointment): AppointmentResponseDto {
    return new AppointmentResponseDto({
      id: appointment.getId()!,
      doctorId: appointment.getDoctorId(),
      patientId: appointment.getPatientId(),
      clinicLocationId: appointment.getClinicLocationId(),
      startTime: appointment.getStartTime(),
      endTime: appointment.getEndTime(),
      createdAt: appointment.getCreatedAt()!,
      updatedAt: appointment.getUpdatedAt()!
    });
  }

  static toPatientDto(appointment: Appointment): AppointmentPatientResponseDto {
    return new AppointmentPatientResponseDto({
      id: appointment.getId()!,
      doctorId: appointment.getDoctorId(),
      patientId: appointment.getPatientId(),
      clinicLocationId: appointment.getClinicLocationId(),
      startTime: appointment.getStartTime(),
      endTime: appointment.getEndTime(),
      createdAt: appointment.getCreatedAt()!,
      updatedAt: appointment.getUpdatedAt()!,
      doctor: appointment.getDoctor() ? DoctorMapper.toDto(appointment.getDoctor()) : undefined, 
      clinicLocation: appointment.getClinicLocation() ? ClinicMapper.toDto(appointment.getClinicLocation()) : undefined,
    });
  }

  static toDoctorDto(appointment: Appointment): AppointmentDoctorResponseDto {
    return new AppointmentDoctorResponseDto({
      id: appointment.getId()!,
      doctorId: appointment.getDoctorId(),
      patientId: appointment.getPatientId(),
      clinicLocationId: appointment.getClinicLocationId(),
      startTime: appointment.getStartTime(),
      endTime: appointment.getEndTime(),
      createdAt: appointment.getCreatedAt()!,
      updatedAt: appointment.getUpdatedAt()!,
      patient: appointment.getPatient() ? UserMapper.toDto(appointment.getPatient()) : undefined, 
      clinicLocation: appointment.getClinicLocation() ? ClinicMapper.toDto(appointment.getClinicLocation()) : undefined,
    });
  }

  static toDtoList(appointments: Appointment[]): AppointmentResponseDto[] {
    return appointments.map((appointment) => this.toDto(appointment));
  }
}
