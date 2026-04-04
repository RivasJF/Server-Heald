import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DoctorDayOffResponseDto } from '../dto/doctor-day-offResponse.dto';
import { IDoctorDayOffRepository } from '../repository/doctor-day-off.repository.imp';
import { DoctorDayOffMapper } from '../mapper/doctor-day-off.mapper';

@Injectable()
export class GetAllDayOffsUseCase {
  constructor(
    @Inject('IDoctorDayOffRepository')
    private readonly doctorDayOffRepository: IDoctorDayOffRepository,
  ) {}

  async execute(doctorId: string): Promise<DoctorDayOffResponseDto[]> {
    const listDayOffs = await this.doctorDayOffRepository.findByDoctorId(doctorId);

    if (listDayOffs.length === 0) {
      throw new NotFoundException(
        `No se encontraron días libres para el doctor ${doctorId}`,
      );
    }

    return DoctorDayOffMapper.toDtoList(listDayOffs);
  }
}
