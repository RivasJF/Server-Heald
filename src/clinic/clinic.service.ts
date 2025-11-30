import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { console } from 'inspector';

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
}
