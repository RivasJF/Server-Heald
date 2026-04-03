import { AppointmentResponseDto } from '../dto/appointmentResponse.dto';
import { Appointment } from '../entities/appointment.entity';

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
      updatedAt: appointment.getUpdatedAt()!,
    });
  }

  static toDtoList(appointments: Appointment[]): AppointmentResponseDto[] {
    return appointments.map((appointment) => this.toDto(appointment));
  }
}
