import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorScheduleDto } from '../dto/create-scheduleRequest.dto';
import { IScheduleRepository } from '../repositories/schedule.repository.imp';
import { IDoctorRepository } from 'src/doctor/repositories/doctor.repository.imp';
import { DoctorSchedule } from '../entities/doctor-schedule.entity';
import { DoctorScheduleDay } from '../entities/doctor-schedule-day.entity';
import { Day } from '../entities/day.enum';
import { DoctorScheduleBreak } from '../entities/doctor-schedule-break.entity';
import { ScheduleMapper } from '../mapper/schedule.mapper';

@Injectable()
export class CreateScheduleUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
    @Inject('IDoctorRepository')
    private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(id: string, data: CreateDoctorScheduleDto) {

    const doctor = await this.doctorRepository.findById(id);

    if (!doctor) {
      throw new NotFoundException(`Doctor con userId ${id} no encontrado.`);
    }

    const days = data.days.map((dayData) => {
      return DoctorScheduleDay.create(dayData.day as Day, dayData.startTime, dayData.endTime);
    });

    const breaks = (data.breaks || []).map((breakData) => {
      return DoctorScheduleBreak.create(breakData.day as Day, breakData.startTime, breakData.endTime);
    });

    const schedule = DoctorSchedule.create(doctor.getId()!, data.consultationTime, days, breaks);

    const newSchedule = await this.scheduleRepository.save(schedule);

    return ScheduleMapper.toDto(newSchedule);
  }
}