import { Injectable } from '@nestjs/common';
import { Appointment as AppointmentSchema } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { Appointment } from '../entities/appointment.entity';
import { IAppointmentRepository } from './appointment.repository.imp';

@Injectable()
export class AppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: Appointment): Promise<Appointment> {
    const id = entity.getId();

    if (!id) {
      const data = await this.prisma.appointment.create({
        data: {
          doctorId: entity.getDoctorId(),
          patientId: entity.getPatientId(),
          clinicLocationId: entity.getClinicLocationId(),
          startTime: entity.getStartTime(),
          endTime: entity.getEndTime(),
        },
      });

      return this.toDomain(data);
    }

    const data = await this.prisma.appointment.update({
      where: { id },
      data: {
        doctorId: entity.getDoctorId(),
        patientId: entity.getPatientId(),
        clinicLocationId: entity.getClinicLocationId(),
        startTime: entity.getStartTime(),
        endTime: entity.getEndTime(),
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return null;
    }

    return this.toDomain(appointment);
  }

  async delete(id: string): Promise<Appointment | null> {
    const appointment = await this.findById(id);

    if (!appointment) {
      return null;
    }

    const deleted = await this.prisma.appointment.delete({
      where: { id },
    });

    return this.toDomain(deleted);
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId },
      orderBy: { startTime: 'asc' },
    });

    return appointments.map((appointment) => this.toDomain(appointment));
  }

  async findByDoctorId(doctorId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId },
      orderBy: { startTime: 'asc' },
    });

    return appointments.map((appointment) => this.toDomain(appointment));
  }

  async findByDoctorIdInRange(
    doctorId: string,
    start: Date,
    end: Date,
  ): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        startTime: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return appointments.map((appointment) => this.toDomain(appointment));
  }

  async findOverlapping(
    doctorId: string,
    clinicLocationId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        clinicLocationId,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (!appointment) {
      return null;
    }

    return this.toDomain(appointment);
  }

  private toDomain(data: AppointmentSchema): Appointment {
    return Appointment.create(
      data.doctorId,
      data.patientId,
      data.clinicLocationId,
      data.startTime,
      data.endTime,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }
}
