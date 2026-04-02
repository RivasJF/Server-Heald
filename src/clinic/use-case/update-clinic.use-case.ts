import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
import { ClinicMapper } from '../mapper/clinic.mapper';
import { IClinicRepository } from '../repository/clinic.repository.imp';

@Injectable()
export class UpdateClinicUseCase {
  constructor(
    @Inject('IClinicRepository')
    private readonly clinicRepository: IClinicRepository,
  ) {}

  async execute(id: string, data: UpdateClinicDto) {
    const clinic = await this.clinicRepository.findById(id);

    if (!clinic) {
      throw new NotFoundException(`Clinic con id ${id} not found`);
    }

    clinic.updateData({
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
    });

    const updatedClinic = await this.clinicRepository.update(clinic);
    return ClinicMapper.toDto(updatedClinic);
  }
}
