import { Clinic } from '../entities/clinic.entity';

export interface IClinicRepository {
  save(entity: Clinic): Promise<Clinic>;
  findAll(): Promise<Clinic[]>;
  findAllWithDoctorAndUserAndServiceStatus(): Promise<Clinic[]>;
  findByCoordinatesRange(
    minLatitude: number,
    maxLatitude: number,
    minLongitude: number,
    maxLongitude: number,
  ): Promise<Clinic[]>;
  findById(id: string): Promise<Clinic | null>;
  findByDoctorId(doctorId: string): Promise<Clinic | null>;
  update(entity: Clinic): Promise<Clinic>;
  delete(id: string): Promise<Clinic | null>;
}
