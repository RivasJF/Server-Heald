export class DoctorDayClose {
  private readonly id?: string;
  private readonly doctorId: string;
  private readonly date: Date;
  private readonly closedAt: string;
  private readonly createdAt?: Date;

  private constructor(
    doctorId: string,
    date: Date,
    closedAt: string,
    id?: string,
    createdAt?: Date,
  ) {
    this.id = id;
    this.doctorId = doctorId;
    this.date = date;
    this.closedAt = closedAt;
    this.createdAt = createdAt;
  }

  static create(
    doctorId: string,
    date: Date,
    closedAt: string,
    id?: string,
    createdAt?: Date,
  ) {
    if (!doctorId || doctorId.trim().length === 0) {
      throw new Error('Doctor id is required');
    }

    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new Error('Date is invalid');
    }

    if (!closedAt || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(closedAt)) {
      throw new Error('closedAt must be in HH:mm format');
    }

    return new DoctorDayClose(doctorId, date, closedAt, id, createdAt);
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

  getClosedAt() {
    return this.closedAt;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}
