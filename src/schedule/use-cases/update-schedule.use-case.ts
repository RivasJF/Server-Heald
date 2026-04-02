import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IScheduleRepository } from '../repositories/schedule.repository.imp';
import { ScheduleMapper } from '../mapper/schedule.mapper';
import { UpdateDoctorScheduleDto } from '../dto/update-scheduleRequest.dto';
import { DoctorScheduleDay } from '../entities/doctor-schedule-day.entity';
import { Day } from '../entities/day.enum';
import { DoctorScheduleBreak } from '../entities/doctor-schedule-break.entity';
import { DoctorSchedule } from '../entities/doctor-schedule.entity';

@Injectable()
export class UpdateScheduleUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(id: string, data: UpdateDoctorScheduleDto) {
    const doctorSchedule = await this.scheduleRepository.findByDoctorId(id);

    if (!doctorSchedule) {
      throw new NotFoundException(
        `Horario para Doctor con userId ${id} no encontrado.`,
      );
    }

    const days =
      data.days !== undefined
        ? data.days.map((dayData) =>
            DoctorScheduleDay.create(
              dayData.day as Day,
              dayData.startTime,
              dayData.endTime,
            ),
          )
        : doctorSchedule.getDays();

    const breaks =
      data.breaks !== undefined
        ? (data.breaks || []).map((breakData) =>
            DoctorScheduleBreak.create(
              breakData.day as Day,
              breakData.startTime,
              breakData.endTime,
            ),
          )
        : doctorSchedule.getBreaks();

    const scheduleToUpdate = DoctorSchedule.create(
      doctorSchedule.getDoctorId(),
      doctorSchedule.getConsultationTime(),
      days,
      breaks,
      doctorSchedule.getId(),
      doctorSchedule.getCreatedAt(),
      doctorSchedule.getUpdatedAt(),
    );

    const updatedSchedule = await this.scheduleRepository.update(scheduleToUpdate);

    return ScheduleMapper.toDto(updatedSchedule);
  }
}