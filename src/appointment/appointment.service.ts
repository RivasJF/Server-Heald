import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { addMinutes, isWithinInterval } from 'date-fns';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async cancelAppointment(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment) {
      throw new NotFoundException(`Cita con id ${appointmentId} no encontrada`);
    }
    return this.prisma.appointment.delete({
      where: { id: appointmentId },
    });
  }

  async create(dto: CreateAppointmentDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (end <= start) {
      throw new BadRequestException('endTime debe ser mayor que startTime');
    }

    const overlapping = await this.prisma.appointment.findFirst({
      where: {
        doctorId: dto.doctorId,
        clinicLocationId: dto.clinicLocationId,
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException('El horario ya está ocupado.');
    }

    return this.prisma.appointment.create({
      data: {
        doctorId: dto.doctorId,
        patientId: dto.patientId,
        clinicLocationId: dto.clinicLocationId,
        startTime: start,
        endTime: end,
      },
    });
  }

  async getAvailabilityForDay(doctorId: string, date: string) {
    return await this.generateAvailability(doctorId, date);
  }

  async findByPatient(patientId: string) {
    return this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: {
            id: true,
            userId: true,
            speciality: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        clinicLocation: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findByDoctor(doctorId: string) {
    return this.prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            birthDate: true,
            role: true,
          },
        },
        clinicLocation: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async generateAvailability(doctorId: string, date: string) {
    const doctor = await this.prisma.doctorServiceStatus.findUnique({
      where: { doctorId: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor no encontrado');
    }

    if (!doctor.active) {
      return {
        date,
        totalSlots: 0,
        availableSlots: 0,
        available: [],
        message: 'El doctor tiene su servicio desactivado',
      };
    }

    const clinicLocation = await this.prisma.clinicLocation.findUnique({
      where: { doctorId: doctorId },
      select: { id: true },
    });
    if (!clinicLocation) {
      throw new NotFoundException(
        `No existe ubicación para el doctor ${doctorId}`,
      );
    }

    // 1. Parsear fecha seleccionada
    const selectedDate = new Date(`${date}T00:00:00`);
    if (isNaN(selectedDate.getTime())) {
      throw new BadRequestException('Fecha inválida');
    }

    const weekday = selectedDate
      .toLocaleDateString('en-US', { weekday: 'short' })
      .toUpperCase(); // MON, TUE...

    const WEEK_MAP = {
      MON: 'MON',
      TUE: 'TUE',
      WED: 'WED',
      THU: 'THU',
      FRI: 'FRI',
      SAT: 'SAT',
      SUN: 'SUN',
    };

    // 2. Cargar horario del doctor
    const schedule = await this.prisma.doctorSchedule.findUnique({
      where: { doctorId },
      include: {
        days: true,
        breaks: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`No existe horario para doctor ${doctorId}`);
    }

    const isDayOff = `${date}T00:00:00.000Z`;

    const dayOff = await this.prisma.doctorDayOff.findFirst({
      where: {
        doctorId,
        date: isDayOff,
      },
    });

    if (dayOff) {
      return {
        date,
        totalSlots: 0,
        availableSlots: 0,
        available: [],
        message: 'El doctor no atenderá este día',
      };
    }

    const dayConfig = schedule.days.find((d) => d.day === WEEK_MAP[weekday]);

    if (!dayConfig) {
      return {
        date,
        available: [],
        message: 'El doctor no trabaja este día',
      };
    }

    // Buscar si hay un cierre anticipado para este día
    const dailyClosure = await this.prisma.doctorDayClose.findFirst({
      where: {
        doctorId,
        date: selectedDate,
      },
    });

    // 3. Crear intervalos de trabajo del día
    const dayStart = new Date(`${date}T${dayConfig.startTime}:00`);
    let dayEnd = new Date(`${date}T${dayConfig.endTime}:00`);

    // Si hay un cierre, ajustar la hora de fin del día si es más temprano
    if (dailyClosure) {
      const closureTime = new Date(`${date}T${dailyClosure.closedAt}:00`);
      if (closureTime < dayEnd) {
        dayEnd = closureTime;
      }
    }

    // 4. Generar slots basados en consultationTime
    const slots: { start: Date; end: Date }[] = [];

    let current = dayStart;
    while (current < dayEnd) {
      const slotEnd = addMinutes(current, schedule.consultationTime);

      if (slotEnd <= dayEnd) {
        slots.push({
          start: new Date(current),
          end: new Date(slotEnd),
        });
      }

      current = slotEnd;
    }

    // 5. Eliminar slots que coinciden con breaks
    const todaysBreaks = schedule.breaks.filter(
      (b) => b.day === WEEK_MAP[weekday],
    );

    const slotsAfterBreak = slots.filter((slot) => {
      return !todaysBreaks.some((b) => {
        const breakStart = new Date(`${date}T${b.startTime}:00`);
        const breakEnd = new Date(`${date}T${b.endTime}:00`);
        return (
          slot.start.getTime() >= breakStart.getTime() &&
          slot.start.getTime() < breakEnd.getTime()
        );
      });
    });

    // 6. Obtener citas del día
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        startTime: {
          gte: new Date(`${date}T00:00:00`),
          lt: new Date(`${date}T23:59:59`),
        },
      },
    });

    const slotsAfterAppointments = slotsAfterBreak.filter((slot) => {
      return !appointments.some((app) => {
        const appStart = new Date(app.startTime).getTime();
        return slot.start.getTime() === appStart;
      });
    });

    // 7. Se elimina el filtro de "slots pasados" para el día actual, según solicitado.
    const filteredByTime = slotsAfterAppointments;

    const formattedAvailable = filteredByTime.map((s) => ({
      start: s.start.toISOString(),
      end: s.end.toISOString(),
    }));
    return {
      date,
      totalSlots: slots.length,
      availableSlots: formattedAvailable.length,
      clinicLocationId: clinicLocation.id,
      available: formattedAvailable,
    };
  }
}
