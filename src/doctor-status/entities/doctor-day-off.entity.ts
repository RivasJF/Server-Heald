export class DoctorDayOff {
  private readonly id?: string;
  private readonly doctorId: string;
  private readonly date: Date;
  private readonly createdAt?: Date;

  private constructor(
    doctorId: string,
    date: Date,
    id?: string,
    createdAt?: Date,
  ) {
    this.id = id;
    this.doctorId = doctorId;
    this.date = date;
    this.createdAt = createdAt;
  }

  static create(
    doctorId: string,
    date: Date,
    id?: string,
    createdAt?: Date,
  ) {
    if (!doctorId || doctorId.trim().length === 0) {
      throw new Error('Doctor id is required');
    }

    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new Error('Date is invalid');
    }

    return new DoctorDayOff(doctorId, date, id, createdAt);
  }

  getId() {
    return this.id;
  }

  getDoctorId() {
    return this.doctorId;
  }

  getDate() {
    return this.date;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}
