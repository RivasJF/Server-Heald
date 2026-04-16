import { DoctorDayOff } from '../entities/doctor-day-off.entity';

export interface IDoctorDayOffRepository {
  save(entity: DoctorDayOff): Promise<DoctorDayOff>;
  findByDoctorId(doctorId: string): Promise<DoctorDayOff[]>;
  findByDoctorIdAndDate(doctorId: string, date: Date): Promise<DoctorDayOff | null>;
  deleteByDoctorIdAndDate(doctorId: string, date: Date): Promise<number>;
}
