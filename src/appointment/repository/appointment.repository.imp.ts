import { Appointment } from '../entities/appointment.entity';

export interface IAppointmentRepository {
  save(entity: Appointment): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  delete(id: string): Promise<Appointment | null>;
  findByPatientId(patientId: string): Promise<Appointment[]>;
  findByPatientIdPagination(patientId: string,page:number, pageSize:number): Promise<Appointment[]>;
  findByDoctorId(doctorId: string): Promise<Appointment[]>;
  findByDoctorIdPagination(doctorId: string, page: number, pageSize: number): Promise<Appointment[]>;
  findByDoctorIdInRange(
    doctorId: string,
    start: Date,
    end: Date,
  ): Promise<Appointment[]>;
  findOverlapping(
    doctorId: string,
    clinicLocationId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Appointment | null>;
}
