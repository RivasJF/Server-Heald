import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { Clinic } from '../entities/clinic.entity';
import { ClinicMapper } from '../mapper/clinic.mapper';
import { IClinicRepository } from '../repository/clinic.repository.imp';
import { PrismaService } from 'src/prisma/prisma.service';
import { IDoctorRepository } from 'src/doctor/repositories/doctor.repository.imp';

@Injectable()
export class CreateClinicUseCase {
  constructor(
    @Inject('IClinicRepository')
    private readonly clinicRepository: IClinicRepository,
    @Inject('IDoctorRepository')
    private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(data: CreateClinicDto) {
    const doctor = await this.doctorRepository.findById(data.doctorId);

    if (!doctor) {
      throw new NotFoundException(
        `Doctor con userId ${data.doctorId} no encontrado.`,
      );
    }

    const clinic = Clinic.create(
      data.latitude,
      data.longitude,
      data.address,
      data.doctorId,
    );

    const newClinic = await this.clinicRepository.save(clinic);
    return ClinicMapper.toDto(newClinic);
  }
}
