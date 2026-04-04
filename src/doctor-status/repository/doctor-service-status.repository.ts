import { Injectable } from '@nestjs/common';
import { DoctorServiceStatus as DoctorServiceStatusSchema } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { DoctorServiceStatus } from '../entities/doctor-service-status.entity';
import { IDoctorServiceStatusRepository } from './doctor-service-status.repository.imp';

@Injectable()
export class DoctorServiceStatusRepository
  implements IDoctorServiceStatusRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: DoctorServiceStatus): Promise<DoctorServiceStatus> {
    const id = entity.getId();

    if (!id) {
      const data = await this.prisma.doctorServiceStatus.create({
        data: {
          doctorId: entity.getDoctorId(),
          active: entity.getActive(),
        },
      });

      return this.toDomain(data);
    }

    const data = await this.prisma.doctorServiceStatus.update({
      where: { id },
      data: {
        active: entity.getActive(),
      },
    });

    return this.toDomain(data);
  }

  async findByDoctorId(doctorId: string): Promise<DoctorServiceStatus | null> {
    const row = await this.prisma.doctorServiceStatus.findUnique({
      where: { doctorId },
    });

    return row ? this.toDomain(row) : null;
  }

  private toDomain(data: DoctorServiceStatusSchema): DoctorServiceStatus {
    return DoctorServiceStatus.create(
      data.doctorId,
      data.active,
      data.id,
      data.updatedAt,
    );
  }
}
