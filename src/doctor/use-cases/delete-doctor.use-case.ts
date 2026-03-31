import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDoctorRepository } from '../repositories/doctor.repository.imp';
import { DoctorMapper } from '../mapper/doctor.mapper';

@Injectable()
export class DeleteDoctorUseCase {
  constructor(
    @Inject('IDoctorRepository')
    private readonly doctorRepo: IDoctorRepository,
  ) {}

  async execute(id: string) {
    const deletedDoctor = await this.doctorRepo.delete(id);
    if (!deletedDoctor) {
      throw new NotFoundException(`Doctor con id ${id} no encontrado`);
    }

    return DoctorMapper.toDto(deletedDoctor);
  }
}
