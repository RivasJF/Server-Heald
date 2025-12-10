import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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

  async deleteDayOff(doctorId: string, dto: CreateDayOffDto) {
    const date = new Date(dto.date);

    const dayOff = await this.prisma.doctorDayOff.findFirst({
      where: {
        doctorId,
        date,
      },
    });


    if (!dayOff) {
      throw new NotFoundException(
        `No se encontró un día libre para el doctor ${doctorId} en la fecha ${dto.date}`,
      );
    }

    await this.prisma.doctorDayOff.deleteMany({ where: { doctorId, date } });

    return { message: 'El día libre ha sido eliminado exitosamente.' };
  }

  // 2. Cierre anticipado en un día específico
  async setDailyClosure(doctorId: string, dto: CreateDayCloseDto) {
  const dateOnly = new Date(`${dto.date}T00:00:00`);

    const existingClosure = await this.prisma.doctorDayClose.findFirst({
      where: {
        doctorId,
        date: dateOnly,
      },
    });

    if (existingClosure) {
      throw new BadRequestException(`Ya existe un cierre anticipado para esta fecha.`);
    }

    return this.prisma.doctorDayClose.create({
      data: {
        doctorId,
        date: dateOnly,
        closedAt: dto.closedAt,
      },
    });
  }

  async deleteDailyClosure(doctorId: string, dto: CreateDayOffDto) {
    const dateOnly = new Date(`${dto.date}T00:00:00`);

    const closure = await this.prisma.doctorDayClose.findFirst({
      where: {
        doctorId,
        date: dateOnly,
        },
    });

    if (!closure) {
      throw new NotFoundException(
        `No se encontró un cierre anticipado para el doctor ${doctorId} en la fecha ${dto.date}`,
      );
    }
    await this.prisma.doctorDayClose.deleteMany({ where: { doctorId, date: dateOnly } });

    return { message: 'El cierre anticipado ha sido eliminado exitosamente.' };
  }


  // 3. Cerrar servicio indefinidamente
  async setServiceStatus(doctorId: string, dto: UpdateServiceStatusDto) {
    // Si intenta poner active en true, validar que tenga clínica y horario
    if (dto.active === true) {
      // Verificar que existe clínica
      const clinicLocation = await this.prisma.clinicLocation.findUnique({
        where: { doctorId },
      });

      if (!clinicLocation) {
        throw new BadRequestException('El doctor no tiene una clínica asignada');
      }

      // Verificar que existe horario
      const schedule = await this.prisma.doctorSchedule.findUnique({
        where: { doctorId },
      });

      if (!schedule) {
        throw new BadRequestException('El doctor no tiene un horario establecido');
      }
    }

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
