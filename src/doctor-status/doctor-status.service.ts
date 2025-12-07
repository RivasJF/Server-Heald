import { Injectable } from '@nestjs/common';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';
import { CreateDayCloseDto } from './dto/create-day-close';
import { CreateDayOffDto } from './dto/create-day-off.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorStatusService {
    constructor(private prisma: PrismaService) {}

  // 1. Día completo deshabilitado
  async setDayOff(doctorId: string, dto: CreateDayOffDto) {
    return this.prisma.doctorDayOff.create({
      data: {
        doctorId,
        date: new Date(dto.date),
      },
    });
  }

  // 2. Cierre anticipado en un día específico
  async setDailyClosure(doctorId: string, dto: CreateDayCloseDto) {
  const dateOnly = new Date(`${dto.date}T00:00:00`);

  return this.prisma.doctorDayClose.create({
    data: {
      doctorId,
      date: dateOnly,
      closedAt: dto.closedAt,
    },
  });
  }

  // 3. Cerrar servicio indefinidamente
  async setServiceStatus(doctorId: string, dto: UpdateServiceStatusDto) {
    return this.prisma.doctorServiceStatus.upsert({
      where: { doctorId },
      create: {
        doctorId,
        active: dto.active,
      },
      update: {
        active: dto.active,
      },
    });
  }
}
