import { DoctorScheduleBreak } from './doctor-schedule-break.entity';
import { DoctorScheduleDay } from './doctor-schedule-day.entity';

export class DoctorSchedule {
  private readonly id?: string;
  private readonly doctorId: string;
  private consultationTime: number;
  private days: DoctorScheduleDay[];
  private breaks: DoctorScheduleBreak[];
  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;

  private constructor(
    doctorId: string,
    consultationTime = 20,
    days: DoctorScheduleDay[] = [],
    breaks: DoctorScheduleBreak[] = [],
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.doctorId = doctorId;
    this.consultationTime = consultationTime;
    this.days = days;
    this.breaks = breaks;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    doctorId: string,
    consultationTime = 20,
    days: DoctorScheduleDay[] = [],
    breaks: DoctorScheduleBreak[] = [],
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    if (!doctorId || doctorId.trim().length === 0) {
      throw new Error('Doctor id is required');
    }

    if (consultationTime <= 0) {
      throw new Error('Consultation time must be greater than 0');
    }

    return new DoctorSchedule(
      doctorId,
      consultationTime,
      days,
      breaks,
      id,
      createdAt,
      updatedAt,
    );
  }

  updateConsultationTime(minutes: number) {
    if (minutes <= 0) {
      throw new Error('Consultation time must be greater than 0');
    }

    this.consultationTime = minutes;
  }

  getId() {
    return this.id;
  }

  getDoctorId() {
    return this.doctorId;
  }

  getConsultationTime() {
    return this.consultationTime;
  }

  getDays() {
    return this.days;
  }

  getBreaks() {
    return this.breaks;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }
}
