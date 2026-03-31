import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateDoctorDto } from '../dto/doctorUpdateRequest.dto';
import { IDoctorRepository } from '../repositories/doctor.repository.imp';
import { DoctorMapper } from '../mapper/doctor.mapper';

@Injectable()
export class UpdateDoctorUseCase {
  constructor(
    @Inject('IDoctorRepository')
    private readonly doctorRepo: IDoctorRepository,
  ) {}

  async execute(id: string, updateDoctorDto: UpdateDoctorDto) {
    const existingDoctor = await this.doctorRepo.findById(id);
    if (!existingDoctor) {
      throw new NotFoundException(`Doctor con id ${id} no encontrado`);
    }

    existingDoctor.updateData({
      speciality: updateDoctorDto.speciality,
      biography: updateDoctorDto.biography,
    });

    const updatedDoctor = await this.doctorRepo.save(existingDoctor);
    return DoctorMapper.toDto(updatedDoctor);
  }
}
