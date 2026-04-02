import { Injectable } from '@nestjs/common';
import { ClinicLocation as ClinicLocationSchema } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { Clinic } from '../entities/clinic.entity';
import { IClinicRepository } from './clinic.repository.imp';

@Injectable()
export class ClinicRepository implements IClinicRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: Clinic): Promise<Clinic> {
    const id = entity.getId();

    if (!id) {
      const data = await this.prisma.clinicLocation.create({
        data: {
          latitude: entity.getLatitude(),
          longitude: entity.getLongitude(),
          address: entity.getAddress(),
          doctorId: entity.getDoctorId(),
        },
      });

      return this.toDomain(data);
    }

    const data = await this.prisma.clinicLocation.update({
      where: { id },
      data: {
        latitude: entity.getLatitude(),
        longitude: entity.getLongitude(),
        address: entity.getAddress(),
        doctorId: entity.getDoctorId(),
      },
    });

    return this.toDomain(data);
  }

  async findAll(): Promise<Clinic[]> {
    const clinics = await this.prisma.clinicLocation.findMany();
    return clinics.map((clinic) => this.toDomain(clinic));
  }

  async findByCoordinatesRange(
    minLatitude: number,
    maxLatitude: number,
    minLongitude: number,
    maxLongitude: number,
  ): Promise<Clinic[]> {
    const clinics = await this.prisma.clinicLocation.findMany({
      where: {
        latitude: {
          gte: minLatitude,
          lte: maxLatitude,
        },
        longitude: {
          gte: minLongitude,
          lte: maxLongitude,
        },
      },
    });

    return clinics.map((clinic) => this.toDomain(clinic));
  }

  async findById(id: string): Promise<Clinic | null> {
    const clinic = await this.prisma.clinicLocation.findUnique({
      where: { id },
    });

    if (!clinic) {
      return null;
    }

    return this.toDomain(clinic);
  }

  async findByDoctorId(doctorId: string): Promise<Clinic | null> {
    const clinic = await this.prisma.clinicLocation.findUnique({
      where: { doctorId },
    });

    if (!clinic) {
      return null;
    }

    return this.toDomain(clinic);
  }

  async update(entity: Clinic): Promise<Clinic> {
    const id = entity.getId();

    const data = await this.prisma.clinicLocation.update({
      where: { id },
      data: {
        latitude: entity.getLatitude(),
        longitude: entity.getLongitude(),
        address: entity.getAddress(),
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<Clinic | null> {

    const deleted = await this.prisma.clinicLocation.delete({
      where: { id },
    });

    return this.toDomain(deleted);
  }

  private toDomain(data: ClinicLocationSchema): Clinic {
    return Clinic.create(
      data.latitude,
      data.longitude,
      data.address,
      data.doctorId,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }
}
