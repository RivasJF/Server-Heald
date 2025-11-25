import { Doctor as DoctorPrisma } from "generated/prisma";

export class Doctor implements DoctorPrisma {
    id: string;
    userId: string;
    speciality: string | null;
    biography: string | null;
    consultationTime: number;
    specialty: string;
    createdAt: Date;
    updatedAt: Date;
}
