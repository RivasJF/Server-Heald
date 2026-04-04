import { Injectable } from '@nestjs/common';
import { DoctorDayClose as DoctorDayCloseSchema } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { DoctorDayClose } from '../entities/doctor-day-close.entity';
import { IDoctorDayCloseRepository } from './doctor-day-close.repository.imp';

@Injectable()
export class DoctorDayCloseRepository implements IDoctorDayCloseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: DoctorDayClose): Promise<DoctorDayClose> {
    const id = entity.getId();

    if (!id) {
      const data = await this.prisma.doctorDayClose.create({
        data: {
          doctorId: entity.getDoctorId(),
          date: entity.getDate(),
          closedAt: entity.getClosedAt(),
        },
      });

      return this.toDomain(data);
    }

    const data = await this.prisma.doctorDayClose.update({
      where: { id },
      data: {
        doctorId: entity.getDoctorId(),
        date: entity.getDate(),
        closedAt: entity.getClosedAt(),
      },
    });

    return this.toDomain(data);
  }

  async findByDoctorIdAndDate(
    doctorId: string,
    date: Date,
  ): Promise<DoctorDayClose | null> {
    const row = await this.prisma.doctorDayClose.findFirst({
      where: { doctorId, date },
    });

    return row ? this.toDomain(row) : null;
  }

  async deleteByDoctorIdAndDate(doctorId: string, date: Date): Promise<number> {
    const result = await this.prisma.doctorDayClose.deleteMany({
      where: { doctorId, date },
    });

    return result.count;
  }

  private toDomain(data: DoctorDayCloseSchema): DoctorDayClose {
    return DoctorDayClose.create(
      data.doctorId,
      data.date,
      data.closedAt,
      data.id,
      data.createdAt,
    );
  }
}
