import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDoctorDayOffRepository } from '../repository/doctor-day-off.repository.imp';

@Injectable()
export class DeleteDayOffUseCase {
  constructor(
    @Inject('IDoctorDayOffRepository')
    private readonly doctorDayOffRepository: IDoctorDayOffRepository,
  ) {}

  async execute(doctorId: string, date: string): Promise<{ message: string }> {
    const parsedDate = new Date(date);

    const dayOff = await this.doctorDayOffRepository.findByDoctorIdAndDate(
      doctorId,
      parsedDate,
    );

    if (!dayOff) {
      throw new NotFoundException(
        `No se encontró un día libre para el doctor ${doctorId} en la fecha ${date}`,
      );
    }

    await this.doctorDayOffRepository.deleteByDoctorIdAndDate(
      doctorId,
      parsedDate,
    );

    return { message: 'El día libre ha sido eliminado exitosamente.' };
  }
}
