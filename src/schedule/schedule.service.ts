import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDoctorScheduleDto } from './dto/create-schedule.dto';
import { Day } from 'generated/prisma';

@Injectable()
export class ScheduleService {
    constructor(private readonly prisma: PrismaService){}
    
    /**
   * Crea un nuevo horario para un doctor.
   * @param userId - El ID del usuario asociado al Doctor.
   * @param data - Los datos del nuevo horario.
   */
  async createSchedule(id: string, data: CreateDoctorScheduleDto) {
    // 1. Encontrar el registro Doctor asociado al userId.
    const doctor = await this.prisma.doctor.findUnique({
      where: { id:id },
      select: { id: true },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor con userId ${id} no encontrado.`);
    }

    // 2. Crear el DoctorSchedule y las relaciones anidadas (days y breaks).
    // Usamos 'create' con un objeto anidado para manejar las relaciones 1:N.
    return this.prisma.doctorSchedule.create({
      data: {
        doctorId: doctor.id,
        consultationTime: data.consultationTime,
        // Conexión anidada para DoctorScheduleDay
        days: {
          createMany: {
            data: data.days.map((dayData) => ({
              day: dayData.day as Day,
              startTime: dayData.startTime,
              endTime: dayData.endTime,
            })),
          },
        },
        // Conexión anidada para DoctorBreak
        breaks: {
          createMany: {
            data:(data.breaks || []).map((breakData) => ({
              day: breakData.day as Day, 
              startTime: breakData.startTime,
              endTime: breakData.endTime,
            })),
          },
        },
      },
      // Incluir las relaciones para la respuesta
      include: {
        days: true,
        breaks: true,
      },
    });
  }

  async getScheduleByUserId(id: string) {
    const schedule = await this.prisma.doctorSchedule.findUnique({
      where: { doctorId:id },
      include: {
        days: true,
        breaks: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException(
        `Horario para Doctor con userId ${id} no encontrado.`,
      );
    }

    return schedule;
  }
}
