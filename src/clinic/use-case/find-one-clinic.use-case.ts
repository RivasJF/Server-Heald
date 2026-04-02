import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClinicMapper } from '../mapper/clinic.mapper';
import { IClinicRepository } from '../repository/clinic.repository.imp';

@Injectable()
export class FindOneClinicUseCase {
  constructor(
    @Inject('IClinicRepository')
    private readonly clinicRepository: IClinicRepository,
  ) {}

  async execute(doctorId: string) {
    const clinic = await this.clinicRepository.findByDoctorId(doctorId);

    if (!clinic) {
      throw new NotFoundException(`Clinic con id doctor ${doctorId} not found`);
    }

    return ClinicMapper.toDto(clinic);
  }
}
