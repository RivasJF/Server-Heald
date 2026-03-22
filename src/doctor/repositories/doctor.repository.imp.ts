import { Doctor } from "../entities/doctor.entity";

export interface IDoctorRepository {
    findById(id: string): Promise<Doctor | null>;
    findMany(): Promise<Doctor[]>;
    save(entity: Doctor): Promise<Doctor>;
    createStatus(doctorId: string): Promise<void>;
}