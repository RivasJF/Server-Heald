import { DoctorServiceStatus } from '../entities/doctor-service-status.entity';

export interface IDoctorServiceStatusRepository {
  save(entity: DoctorServiceStatus): Promise<DoctorServiceStatus>;
  findByDoctorId(doctorId: string): Promise<DoctorServiceStatus | null>;
}
