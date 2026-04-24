import { Injectable } from '@nestjs/common';
import { Appointment as AppointmentSchema } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { Appointment } from '../entities/appointment.entity';
import { IAppointmentRepository } from './appointment.repository.imp';
import { Doctor as DoctorSchema } from 'generated/prisma';
import { User as UserSchema } from 'generated/prisma';
import { ClinicLocation as ClinicLocationSchema } from 'generated/prisma';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Clinic } from 'src/clinic/entities/clinic.entity';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/entities/user.enum';

type AppointmentWithInclude = AppointmentSchema & {
  doctor?: DoctorSchema & {
    user?: UserSchema | null;
  };
  patient?: UserSchema | null;
  clinicLocation?: ClinicLocationSchema | null;
};

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
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        clinicLocation: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return appointments.map((appointment) => this.toDomain(appointment));
  }

  async findByPatientIdPagination(patientId: string,page: number, pageSize:number): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        clinicLocation: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { startTime: 'asc' },
    });

    return appointments.map((appointment) => this.toDomain(appointment));
  }

  async findByDoctorId(doctorId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: true,
        clinicLocation: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return appointments.map((appointment) => this.toDomain(appointment));
  }

  async findByDoctorIdPagination(doctorId: string, page: number, pageSize: number): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: true,
        clinicLocation: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
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

  private toDomain(data: AppointmentSchema | AppointmentWithInclude): Appointment {
    const doctor =
      'doctor' in data && data.doctor
        ? Doctor.create(
            data.doctor.userId,
            data.doctor.speciality ?? undefined,
            data.doctor.biography ?? undefined,
            data.doctor.id,
            data.doctor.createdAt,
            data.doctor.updatedAt,
            data.doctor.user ? UserMapper.toDomain(data.doctor.user) : undefined,
          )
        : undefined;

    const patient = 
      'patient' in data && data.patient
        ? User.create(
            data.patient.name,
            data.patient.email,
            data.patient.password,
            data.patient.role as Role,
            data.patient.phoneNumber,
            data.patient.birthDate,
            data.patient.id,
            data.patient.createdAt,
            data.patient.updatedAt,
          )
        : undefined;
    const clinicLocation =
      'clinicLocation' in data && data.clinicLocation
        ? Clinic.create(
            data.clinicLocation.latitude,
            data.clinicLocation.longitude,
            data.clinicLocation.address,
            data.clinicLocation.doctorId,
            data.clinicLocation.id,
            data.clinicLocation.createdAt,
            data.clinicLocation.updatedAt,
          )
        : undefined;

    return Appointment.create(
      data.doctorId,
      data.patientId,
      data.clinicLocationId,
      data.startTime,
      data.endTime,
      data.id,
      data.createdAt,
      data.updatedAt,
      doctor,
      patient,
      clinicLocation,
    );
  }
}
