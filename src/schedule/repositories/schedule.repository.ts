import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DoctorSchedule } from '../entities/doctor-schedule.entity';
import { IScheduleRepository } from './schedule.repository.imp';
import { DoctorSchedule as DoctorScheduleSchema } from 'generated/prisma';
import { DoctorScheduleDay as DoctorScheduleDaySchema } from 'generated/prisma';
import { DoctorBreak as DoctorBreakSchema } from 'generated/prisma';
import { DoctorScheduleDay } from '../entities/doctor-schedule-day.entity';
import { Day } from '../entities/day.enum';
import { DoctorScheduleBreak } from '../entities/doctor-schedule-break.entity';

type DoctorScheduleWithInclude = DoctorScheduleSchema & {
  days: DoctorScheduleDaySchema[];
  breaks: DoctorBreakSchema[];
};

@Injectable()
export class ScheduleRepository implements IScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: DoctorSchedule): Promise<DoctorSchedule> {
    const schedule = await this.prisma.doctorSchedule.create({
      data: {
        doctorId: entity.getDoctorId(),
        consultationTime: entity.getConsultationTime(),
        days: {
          createMany: {
            data: entity.getDays().map((dayData) => ({
              day: dayData.getDay() as Day,
              startTime: dayData.getStartTime(),
              endTime: dayData.getEndTime(),
            })),
          },
        },
        breaks: {
          createMany: {
            data: (entity.getBreaks() || []).map((breakData) => ({
              day: breakData.getDay() as Day,
              startTime: breakData.getStartTime(),
              endTime: breakData.getEndTime(),
            })),
          },
        },
      },
      include: {
        days: true,
        breaks: true,
      },
    });
    return this.toDomain(schedule);
  }

  async findByDoctorId(doctorId: string): Promise<DoctorSchedule | null> {
    const schedule = await this.prisma.doctorSchedule.findUnique({
      where: { doctorId },
      include: {
        days: true,
        breaks: true,
      },
    });
    if (!schedule) {
      return null;
    }
    return this.toDomain(schedule);
  }

  async update(entity: DoctorSchedule): Promise<DoctorSchedule> {
    const scheduleId = entity.getId()!;

    await this.prisma.doctorScheduleDay.deleteMany({
      where: { scheduleId },
    });

    await this.prisma.doctorBreak.deleteMany({
      where: { scheduleId },
    });

    const schedule = await this.prisma.doctorSchedule.update({
      where: { id: scheduleId },
      data: {
        days: {
          createMany: {
            data: entity.getDays().map((dayData) => ({
              day: dayData.getDay() as Day,
              startTime: dayData.getStartTime(),
              endTime: dayData.getEndTime(),
            })),
          },
        },
        breaks: {
          createMany: {
            data: (entity.getBreaks() || []).map((breakData) => ({
              day: breakData.getDay() as Day,
              startTime: breakData.getStartTime(),
              endTime: breakData.getEndTime(),
            })),
          },
        },
      },
      include: {
        days: true,
        breaks: true,
      },
    });

    return this.toDomain(schedule);
  }

  private toDomain(
    data: DoctorScheduleSchema | DoctorScheduleWithInclude,
  ): DoctorSchedule {
    const days =
      'days' in data && data.days
        ? data.days.map((day) => this.toDomainDays(day))
        : undefined;
    const breaks =
      'breaks' in data && data.breaks
        ? data.breaks.map((breakItem) => this.toDomainBreaks(breakItem))
        : undefined;
    return DoctorSchedule.create(
      data.doctorId,
      data.consultationTime,
      days,
      breaks,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }

  private toDomainDays(data: DoctorScheduleDaySchema): DoctorScheduleDay {
    return DoctorScheduleDay.create(
      data.day as Day,
      data.startTime,
      data.endTime,
      data.id,
      data.scheduleId,
    );
  }

  private toDomainBreaks(data: DoctorBreakSchema): DoctorScheduleBreak {
    return DoctorScheduleBreak.create(
      data.day as Day,
      data.startTime,
      data.endTime,
      data.id,
      data.scheduleId,
    );
  }
}
