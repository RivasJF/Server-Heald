import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDoctorRepository } from '../repositories/doctor.repository.imp';
import { DoctorMapper } from '../mapper/doctor.mapper';

@Injectable()
export class GetDoctorByUserIdUseCase {
  constructor(
    @Inject('IDoctorRepository')
    private readonly doctorRepo: IDoctorRepository,
  ) {}

  async execute(userId: string) {
    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) {
      throw new NotFoundException(`Doctor con userId ${userId} no encontrado`);
    }

    return DoctorMapper.toDto(doctor);
  }
}
