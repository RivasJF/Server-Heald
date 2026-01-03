import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Injectable()
export class ClinicService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateClinicDto) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id: data.doctorId },
            select: { id: true },
        });

        if (!doctor) {
            throw new NotFoundException(`Doctor con userId ${data.doctorId} no encontrado.`);
        }

    return this.prisma.clinicLocation.create({
      data
    });
  }

  findAll() {
    return this.prisma.clinicLocation.findMany();
  }

  async findOne(doctorId: string) {
    const clinic = await this.prisma.clinicLocation.findUnique({
      where: { doctorId },
    });

    if (!clinic) {
      throw new NotFoundException(`Clinic con id doctor ${doctorId} not found`);
    }

    return clinic;
  }

  async update(id: string, data: UpdateClinicDto) {
    const clinic = await this.prisma.clinicLocation.findUnique({
      where: { id },
    });

    if(!clinic){
        throw new NotFoundException(`Clinic con id ${id} not found`);
    }

    return this.prisma.clinicLocation.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.clinicLocation.delete({
      where: { id },
    });
  }

  async findNearby(lat: number, lng: number, radius: number) {
    // Nota: Esta implementación es para SQLite y calcula la distancia manualmente.
    // Para un mejor rendimiento con grandes volúmenes de datos, se recomienda migrar a PostgreSQL con PostGIS.
    const allClinics = await this.prisma.clinicLocation.findMany({
      include: {
        doctor: {
          include: {
            serviceStatus: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                birthDate: true,
                role: true,
              },
            },
          },
        },
      },
    });

    const clinicsWithDistance = allClinics
      .map((clinic) => {
        const distance = this.getDistance(lat, lng, clinic.latitude, clinic.longitude);
        return { ...clinic, distance };
      })
      .filter((clinic) => clinic.distance <= radius);

    // Ordenar por distancia
    clinicsWithDistance.sort((a, b) => a.distance - b.distance);

    return clinicsWithDistance;
  }

    private getDistance(lat1: number, lon1: number, lat2: number, lon2: number ): number {

    const EARTH_RADIUS_IN_METERS = 6371e3;
    const lat1InRadians = (lat1 * Math.PI) / 180;
    const lat2InRadians = (lat2 * Math.PI) / 180;

    const deltaLatitudeInRadians = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLongitudeInRadians = ((lon2 - lon1) * Math.PI) / 180;

    const haversineCentralAngle =
      Math.pow(Math.sin(deltaLatitudeInRadians / 2), 2) +
      Math.cos(lat1InRadians) *
        Math.cos(lat2InRadians) *
        Math.pow(Math.sin(deltaLongitudeInRadians / 2), 2);

    const angularDistance = 2 * Math.atan2(Math.sqrt(haversineCentralAngle), Math.sqrt(1 - haversineCentralAngle));

    const distanceInMeters = EARTH_RADIUS_IN_METERS * angularDistance;

    return distanceInMeters;
  }
}
