import { DoctorSchedule } from '../entities/doctor-schedule.entity';
import { DoctorScheduleDay } from '../entities/doctor-schedule-day.entity';
import { DoctorScheduleBreak } from '../entities/doctor-schedule-break.entity';
import { ScheduleDayResponseDto } from '../dto/daysResponse.dto';
import { ScheduleBreakResponseDto } from '../dto/breackResponse.dto';
import { ScheduleResponseDto } from '../dto/scheduleResponse.dto';

export class ScheduleMapper {
  static dayToDto(day: DoctorScheduleDay): ScheduleDayResponseDto {
    return {
      id: day.getId()!,
      scheduleId: day.getScheduleId()!,
      day: day.getDay(),
      startTime: day.getStartTime(),
      endTime: day.getEndTime(),
    };
  }

  static breakToDto(
    breakEntity: DoctorScheduleBreak,
  ): ScheduleBreakResponseDto {
    return {
      id: breakEntity.getId()!,
      scheduleId: breakEntity.getScheduleId()!,
      day: breakEntity.getDay(),
      startTime: breakEntity.getStartTime(),
      endTime: breakEntity.getEndTime(),
    };
  }

  static toDto(schedule: DoctorSchedule): ScheduleResponseDto {
    return {
      id: schedule.getId()!,
      doctorId: schedule.getDoctorId(),
      consultationTime: schedule.getConsultationTime(),
      createdAt: schedule.getCreatedAt()!,
      updatedAt: schedule.getUpdatedAt()!,
      days: schedule.getDays().map((day) => this.dayToDto(day)),
      breaks: schedule
        .getBreaks()
        .map((breakEntity) => this.breakToDto(breakEntity)),
    };
  }
}
