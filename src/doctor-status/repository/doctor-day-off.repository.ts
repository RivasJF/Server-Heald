import { Injectable } from '@nestjs/common';
import { DoctorDayOff as DoctorDayOffSchema } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { DoctorDayOff } from '../entities/doctor-day-off.entity';
import { IDoctorDayOffRepository } from './doctor-day-off.repository.imp';

@Injectable()
export class DoctorDayOffRepository implements IDoctorDayOffRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: DoctorDayOff): Promise<DoctorDayOff> {
    const id = entity.getId();

    if (!id) {
      const data = await this.prisma.doctorDayOff.create({
        data: {
          doctorId: entity.getDoctorId(),
          date: entity.getDate(),
        },
      });

      return this.toDomain(data);
    }

    const data = await this.prisma.doctorDayOff.update({
      where: { id },
      data: {
        doctorId: entity.getDoctorId(),
        date: entity.getDate(),
      },
    });

    return this.toDomain(data);
  }

  async findByDoctorId(doctorId: string): Promise<DoctorDayOff[]> {
    const rows = await this.prisma.doctorDayOff.findMany({
      where: { doctorId },
      orderBy: { date: 'asc' },
    });

    return rows.map((row) => this.toDomain(row));
  }

  async findByDoctorIdAndDate(
    doctorId: string,
    date: string,
  ): Promise<DoctorDayOff | null> {
    const row = await this.prisma.doctorDayOff.findFirst({
      where: { doctorId, date },
    });

    return row ? this.toDomain(row) : null;
  }

  async deleteByDoctorIdAndDate(doctorId: string, date: Date): Promise<number> {
    const result = await this.prisma.doctorDayOff.deleteMany({
      where: { doctorId, date },
    });

    return result.count;
  }

  private toDomain(data: DoctorDayOffSchema): DoctorDayOff {
    return DoctorDayOff.create(data.doctorId, data.date, data.id, data.createdAt);
  }
}
