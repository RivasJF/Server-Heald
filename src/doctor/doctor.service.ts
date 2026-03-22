import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/doctorCreateRequest.dto';
import { UpdateDoctorDto } from './dto/doctorUpdateRequest.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Doctor } from 'generated/prisma';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const { userId } = createDoctorDto;
    const existing = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!existing) {
      throw new NotFoundException(`User con id ${userId} no encontrado`);
    }

    const doctor = await this.prisma.doctor.create({ data: createDoctorDto });

    // Crear doctorServiceStatus con active: false
    await this.prisma.doctorServiceStatus.create({
      data: {
        doctorId: doctor.id,
        active: false,
      },
    });

    return doctor;
  }

  async findAll(): Promise<Doctor[]> {
    return await this.prisma.doctor.findMany();
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            birthDate: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor con id ${id} no encontrado`);
    }
    return doctor;
  }

  async findByUserId(userId: string): Promise<Doctor> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      include: {
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
        serviceStatus: true,
      },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor con userId ${userId} no encontrado`);
    }
    return doctor;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    try{
      return await this.prisma.doctor.update({
      where: { id },
      data: updateDoctorDto,
    })
    } catch{
      throw new NotFoundException(`Doctor con id ${id} no encontrado`);
    }
  }

  async remove(id: string): Promise<Doctor> {
    return this.prisma.$transaction(async (prisma) => {
      const doctor = await prisma.doctor.findUnique({ where: { id } });
      if (!doctor) {
        throw new NotFoundException(`Doctor con id ${id} no encontrado`);
      }

      // Eliminar dependencias en cascada
      await prisma.appointment.deleteMany({ where: { doctorId: id } });

      const schedule = await prisma.doctorSchedule.findUnique({
        where: { doctorId: id },
      });

      if (schedule) {
        await prisma.doctorBreak.deleteMany({
          where: { scheduleId: schedule.id },
        });
        await prisma.doctorScheduleDay.deleteMany({
          where: { scheduleId: schedule.id },
        });
        await prisma.doctorSchedule.delete({ where: { doctorId: id } });
      }

      await prisma.doctorDayOff.deleteMany({ where: { doctorId: id } });
      await prisma.doctorDayClose.deleteMany({ where: { doctorId: id } });
      await prisma.doctorServiceStatus.deleteMany({ where: { doctorId: id } });
      await prisma.clinicLocation.deleteMany({ where: { doctorId: id } });

      // Finalmente, eliminar el doctor
      const deletedDoctor = await prisma.doctor.delete({
        where: { id },
      });

      return deletedDoctor;
    });
  }
}
