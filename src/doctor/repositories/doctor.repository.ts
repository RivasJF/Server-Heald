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

  async findByUserId(userId: string): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) return null;
    return this.toDomain(doctor);
  }

  async save(entity: Doctor): Promise<Doctor> {
    const id = entity.getId();

    if (!id) {
      const data = await this.prisma.doctor.create({
        data: {
          userId: entity.getUserId(),
          speciality: entity.getSpeciality() ?? null,
          biography: entity.getBiography() ?? null,
        },
      });

      return this.toDomain(data);
    }

    const data = await this.prisma.doctor.update({
      where: { id },
      data: {
        userId: entity.getUserId(),
        speciality: entity.getSpeciality() ?? null,
        biography: entity.getBiography() ?? null,
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<Doctor | null> {
    const deletedDoctor = await this.prisma.$transaction(async (prisma) => {
      const doctor = await prisma.doctor.findUnique({ where: { id } });
      if (!doctor) {
        return null;
      }

      await prisma.appointment.deleteMany({ where: { doctorId: id } });

      const schedule = await prisma.doctorSchedule.findUnique({
        where: { doctorId: id },
      });

      if (schedule) {
        await prisma.doctorBreak.deleteMany({
          where: { scheduleId: schedule.id },
        });
        await prisma.doctorScheduleDay.deleteMany({
          where: { scheduleId: schedule.id },
        });
        await prisma.doctorSchedule.delete({ where: { doctorId: id } });
      }

      await prisma.doctorDayOff.deleteMany({ where: { doctorId: id } });
      await prisma.doctorDayClose.deleteMany({ where: { doctorId: id } });
      await prisma.doctorServiceStatus.deleteMany({ where: { doctorId: id } });
      await prisma.clinicLocation.deleteMany({ where: { doctorId: id } });

      return prisma.doctor.delete({ where: { id } });
    });

    if (!deletedDoctor) {
      return null;
    }

    return this.toDomain(deletedDoctor);
  }

  private toDomain(data: DoctorSchema) {
    return Doctor.create(
        data.userId,
        data.speciality === null ? undefined : data.speciality,
        data.biography === null ? undefined : data.biography,
        data.id,
        data.createdAt,
        data.updatedAt
    );
}
}