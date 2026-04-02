import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClinicMapper } from '../mapper/clinic.mapper';
import { IClinicRepository } from '../repository/clinic.repository.imp';

@Injectable()
export class RemoveClinicUseCase {
  constructor(
    @Inject('IClinicRepository')
    private readonly clinicRepository: IClinicRepository,
  ) {}

  async execute(id: string) {
    const clinic = await this.clinicRepository.findById(id);

    if (!clinic) {
      throw new NotFoundException(`Clinic con id ${id} not found`);
    }

    const deletedClinic = await this.clinicRepository.delete(id);

    if (!deletedClinic) {
      throw new NotFoundException(`Clinic con id ${id} not found`);
    }

    return ClinicMapper.toDto(deletedClinic);
  }
}
