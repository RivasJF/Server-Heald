import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDoctorScheduleDto } from './dto/create-scheduleRequest.dto';
import { Day } from 'generated/prisma';
import { UpdateDoctorScheduleDto } from './dto/update-scheduleRequest.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ScheduleService {
    constructor(private readonly prisma: PrismaService){}

  async createSchedule(id: string, data: CreateDoctorScheduleDto) {
    
    const doctor = await this.prisma.doctor.findUnique({
      where: { id:id },
      select: { id: true },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor con userId ${id} no encontrado.`);
    }

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

  async updateSchedule(doctorId: string, data: UpdateDoctorScheduleDto) {
        // 1. Encontrar el DoctorSchedule (y el doctorId para la búsqueda)
        const doctorSchedule = await this.prisma.doctorSchedule.findUnique({
            where: { doctorId },
            select: { id: true, doctorId: true }
        });

        if (!doctorSchedule) {
            throw new NotFoundException(`Horario para Doctor con userId ${doctorId} no encontrado.`);
        }

        const scheduleId = doctorSchedule.id;

        // Estructura base para actualizar
        const updateData: Prisma.DoctorScheduleUpdateInput = {};

        // --- Manejo de la actualización de Días de Trabajo (Reemplazo) ---
        if (data.days !== undefined) {
            // 1. Eliminar todos los días existentes para este horario
            await this.prisma.doctorScheduleDay.deleteMany({
                where: { scheduleId },
            });

            // 2. Crear los nuevos registros de días
            updateData.days = {
                createMany: {
                    data: data.days.map((dayData) => ({
                        day: dayData.day as Day,
                        startTime: dayData.startTime,
                        endTime: dayData.endTime,
                        // No es necesario incluir scheduleId aquí, Prisma lo maneja por defecto
                    })),
                },
            };
        }

        // --- Manejo de la actualización de Descansos (Reemplazo) ---
        if (data.breaks !== undefined) {
            // 1. Eliminar todos los descansos existentes para este horario
            await this.prisma.doctorBreak.deleteMany({
                where: { scheduleId },
            });

            // 2. Crear los nuevos registros de descansos
            updateData.breaks = {
                createMany: {
                    data: (data.breaks || []).map((breakData) => ({
                        day: breakData.day as Day,
                        startTime: breakData.startTime,
                        endTime: breakData.endTime,
                    })),
                },
            };
        }

        // 3. Realizar la actualización principal del DoctorSchedule
        return this.prisma.doctorSchedule.update({
            where: { id: scheduleId },
            data: updateData,
            include: {
                days: true,
                breaks: true,
            },
        });
    }
}
