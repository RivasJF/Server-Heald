import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateDayCloseDto } from '../dto/create-day-close';
import { DoctorDayCloseResponseDto } from '../dto/doctor-day-closeResponse.dto';
import { DoctorDayClose } from '../entities/doctor-day-close.entity';
import { DoctorDayCloseMapper } from '../mapper/doctor-day-close.mapper';
import { IDoctorDayCloseRepository } from '../repository/doctor-day-close.repository.imp';

@Injectable()
export class CreateDayCloseUseCase {
  constructor(
    @Inject('IDoctorDayCloseRepository')
    private readonly doctorDayCloseRepository: IDoctorDayCloseRepository,
  ) {}

  async execute(
    doctorId: string,
    data: CreateDayCloseDto,
  ): Promise<DoctorDayCloseResponseDto> {
    const dateOnly = new Date(data.date);

    const existingClosure =
      await this.doctorDayCloseRepository.findByDoctorIdAndDate(
        doctorId,
        dateOnly,
      );

    if (existingClosure) {
      throw new BadRequestException('Ya existe un cierre anticipado para esta fecha.');
    }

    const dayClose = DoctorDayClose.create(doctorId, dateOnly, data.closedAt);
    const created = await this.doctorDayCloseRepository.save(dayClose);

    return DoctorDayCloseMapper.toDto(created);
  }
}
