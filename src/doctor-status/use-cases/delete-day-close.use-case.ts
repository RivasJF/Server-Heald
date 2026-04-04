import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDayOffDto } from '../dto/create-day-off.dto';
import { IDoctorDayCloseRepository } from '../repository/doctor-day-close.repository.imp';

@Injectable()
export class DeleteDayCloseUseCase {
  constructor(
    @Inject('IDoctorDayCloseRepository')
    private readonly doctorDayCloseRepository: IDoctorDayCloseRepository,
  ) {}

  async execute(
    doctorId: string,
    data: CreateDayOffDto,
  ): Promise<{ message: string }> {
    const dateOnly = new Date(`${data.date}T00:00:00`);

    const closure = await this.doctorDayCloseRepository.findByDoctorIdAndDate(
      doctorId,
      dateOnly,
    );

    if (!closure) {
      throw new NotFoundException(
        `No se encontró un cierre anticipado para el doctor ${doctorId} en la fecha ${data.date}`,
      );
    }

    await this.doctorDayCloseRepository.deleteByDoctorIdAndDate(
      doctorId,
      dateOnly,
    );

    return { message: 'El cierre anticipado ha sido eliminado exitosamente.' };
  }
}
