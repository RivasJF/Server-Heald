import { Injectable } from "@nestjs/common";
import { IDoctorRepository } from "./doctor.repository.imp";
import { Doctor } from "../entities/doctor.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { Doctor as DoctorSchema } from "generated/prisma";

@Injectable()
export class DoctorRepository implements IDoctorRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  async findMany(): Promise<Doctor[]> {
    const doctors = await this.prisma.doctor.findMany();
    return doctors.map((doctor) => this.toDomain(doctor));
  }

  async createStatus(doctorId: string): Promise<void> {
    await this.prisma.doctorServiceStatus.create({
      data: {
        doctorId: doctorId,
        active: false,
      },
    });
  }

  async findById(id: string): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) return null;
    return this.toDomain(doctor);
  }

  async save(entity: Doctor): Promise<Doctor> {
    const data = await this.prisma.doctor.create({
        data: {
            userId: entity.getUserId(),
            speciality: entity.getSpeciality(),
            biography: entity.getBiography(),
        },
    });
    return this.toDomain(data);
  }

  private toDomain(data: DoctorSchema) {
    return new Doctor(
        data.userId,
        data.speciality === null ? undefined : data.speciality,
        data.biography === null ? undefined : data.biography,
        data.id,
        data.createdAt,
        data.updatedAt
    );
}
}