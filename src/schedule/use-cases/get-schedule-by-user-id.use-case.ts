import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IScheduleRepository } from '../repositories/schedule.repository.imp';
import { ScheduleMapper } from '../mapper/schedule.mapper';

@Injectable()
export class GetScheduleByUserIdUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(id: string) {
    const schedule = await this.scheduleRepository.findByDoctorId(id);
    if (!schedule) {
      throw new NotFoundException(
        `Horario para Doctor con id ${id} no encontrado.`,
      );
    }
    return ScheduleMapper.toDto(schedule);
  }
}