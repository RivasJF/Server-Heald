import { DoctorSchedule } from '../entities/doctor-schedule.entity';

export interface IScheduleRepository {
  save(entity: DoctorSchedule): Promise<DoctorSchedule>;
  findByDoctorId(doctorId: string): Promise<DoctorSchedule | null>;
  update(entity: DoctorSchedule): Promise<DoctorSchedule>;
}
