import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateServiceStatusDto } from '../dto/update-service-status.dto';
import { DoctorServiceStatusResponseDto } from '../dto/doctor-service-statusResponse.dto';
import { DoctorServiceStatusMapper } from '../mapper/doctor-service-status.mapper';
import { IDoctorServiceStatusRepository } from '../repository/doctor-service-status.repository.imp';
import { DoctorServiceStatus } from '../entities/doctor-service-status.entity';

@Injectable()
export class SetServiceStatusUseCase {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('IDoctorServiceStatusRepository')
    private readonly doctorServiceStatusRepository: IDoctorServiceStatusRepository,
  ) {}

  async execute(
    doctorId: string,
    data: UpdateServiceStatusDto,
  ): Promise<DoctorServiceStatusResponseDto> {
    if (data.active === true) {
      const clinicLocation = await this.prisma.clinicLocation.findUnique({
        where: { doctorId },
      });

      if (!clinicLocation) {
        throw new BadRequestException('El doctor no tiene una clínica asignada');
      }

      const schedule = await this.prisma.doctorSchedule.findUnique({
        where: { doctorId },
      });

      if (!schedule) {
        throw new BadRequestException('El doctor no tiene un horario establecido');
      }
    }

    const status = await this.doctorServiceStatusRepository.findByDoctorId(
      doctorId,
    );

    if (!status) {
      const newStatus = DoctorServiceStatus.create(doctorId, data.active);
      const created = await this.doctorServiceStatusRepository.save(newStatus);
      return DoctorServiceStatusMapper.toDto(created);
    }

    if (data.active) {
      status.activeStatus();
    } else {
      status.deactivateStatus();
    }

    const updated = await this.doctorServiceStatusRepository.save(status);

    return DoctorServiceStatusMapper.toDto(updated);
  }
}
