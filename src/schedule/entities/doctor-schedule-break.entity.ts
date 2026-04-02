import { Day } from './day.enum';

export class DoctorScheduleBreak {
  private readonly id?: string;
  private readonly scheduleId?: string;
  private readonly day: Day;
  private readonly startTime: string;
  private readonly endTime: string;

  private constructor(
    day: Day,
    startTime: string,
    endTime: string,
    id?: string,
    scheduleId?: string,
  ) {
    this.id = id;
    this.scheduleId = scheduleId;
    this.day = day;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  static create(
    day: Day,
    startTime: string,
    endTime: string,
    id?: string,
    scheduleId?: string,
  ) {


    if (!startTime || !endTime) {
      throw new Error('Start and end time are required');
    }

    return new DoctorScheduleBreak(day, startTime, endTime, id, scheduleId);
  }

  getId() {
    return this.id;
  }

  getScheduleId() {
    return this.scheduleId;
  }

  getDay() {
    return this.day;
  }

  getStartTime() {
    return this.startTime;
  }

  getEndTime() {
    return this.endTime;
  }
}
