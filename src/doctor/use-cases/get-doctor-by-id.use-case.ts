import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDoctorRepository } from '../repositories/doctor.repository.imp';
import { DoctorMapper } from '../mapper/doctor.mapper';

@Injectable()
export class GetDoctorByIdUseCase {
  constructor(
    @Inject('IDoctorRepository')
    private readonly doctorRepo: IDoctorRepository,
  ) {}

  async execute(id: string) {
    const doctor = await this.doctorRepo.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor con id ${id} no encontrado`);
    }

    return DoctorMapper.toDto(doctor);
  }
}
