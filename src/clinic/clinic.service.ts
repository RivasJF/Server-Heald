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

  async findOne(id: string) {
    const clinic = await this.prisma.clinicLocation.findUnique({
      where: { id },
      include: { doctor: true },
    });

    if (!clinic) {
      throw new NotFoundException(`Clinic con id ${id} not found`);
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
    const allClinics = await this.prisma.clinicLocation.findMany();

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

  private getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ en radianes
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // en metros
  }
}
