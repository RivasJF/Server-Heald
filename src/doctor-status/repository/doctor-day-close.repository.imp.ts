import { DoctorDayClose } from '../entities/doctor-day-close.entity';

export interface IDoctorDayCloseRepository {
  save(entity: DoctorDayClose): Promise<DoctorDayClose>;
  findByDoctorIdAndDate(doctorId: string, date: Date): Promise<DoctorDayClose | null>;
  deleteByDoctorIdAndDate(doctorId: string, date: Date): Promise<number>;
}
