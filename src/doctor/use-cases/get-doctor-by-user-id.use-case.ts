import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDoctorRepository } from '../repositories/doctor.repository.imp';
import { DoctorMapper } from '../mapper/doctor.mapper';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { DoctorServiceStatusMapper } from 'src/doctor-status/mapper/doctor-service-status.mapper';

@Injectable()
export class GetDoctorByUserIdUseCase {
  constructor(
    @Inject('IDoctorRepository')
    private readonly doctorRepo: IDoctorRepository,
  ) {}

  async execute(userId: string) {
    const doctor =
      await this.doctorRepo.findByUserIdWithUserAndServiceStatus(userId);
    if (!doctor) {
      throw new NotFoundException(`Doctor con userId ${userId} no encontrado`);
    }

    const doctorDto = DoctorMapper.toDto(doctor);
    doctorDto.user = UserMapper.toDto(doctor.getUser()!);
    doctorDto.serviceStatus = DoctorServiceStatusMapper.toDto(doctor.getServiceStatus()!);

    return doctorDto;
  }
}
