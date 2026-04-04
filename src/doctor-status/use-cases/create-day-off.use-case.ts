import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DoctorDayOff } from '../entities/doctor-day-off.entity';
import { DoctorDayOffMapper } from '../mapper/doctor-day-off.mapper';
import { IDoctorDayOffRepository } from '../repository/doctor-day-off.repository.imp';
import { DoctorDayOffResponseDto } from '../dto/doctor-day-offResponse.dto';
import { CreateDayOffDto } from '../dto/create-day-off.dto';

@Injectable()
export class CreateDayOffUseCase {
  constructor(
    @Inject('IDoctorDayOffRepository')
    private readonly doctorDayOffRepository: IDoctorDayOffRepository,
  ) {}

  async execute(
    doctorId: string,
    data: CreateDayOffDto,
  ): Promise<DoctorDayOffResponseDto> {
    const parsedDate = new Date(data.date);

    const existingDayOff =
      await this.doctorDayOffRepository.findByDoctorIdAndDate(
        doctorId,
        parsedDate,
      );

    if (existingDayOff) {
      throw new BadRequestException('Ya existe un día libre para esta fecha.');
    }

    const dayOff = DoctorDayOff.create(doctorId, parsedDate);
    const created = await this.doctorDayOffRepository.save(dayOff);

    return DoctorDayOffMapper.toDto(created);
  }
}
