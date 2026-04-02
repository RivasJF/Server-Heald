import { Inject, Injectable } from '@nestjs/common';
import { ClinicMapper } from '../mapper/clinic.mapper';
import { IClinicRepository } from '../repository/clinic.repository.imp';

@Injectable()
export class FindAllClinicUseCase {
  constructor(
    @Inject('IClinicRepository')
    private readonly clinicRepository: IClinicRepository,
  ) {}

  async execute() {
    const clinics = await this.clinicRepository.findAll();
    return clinics.map((clinic) => ClinicMapper.toDto(clinic));
  }
}
