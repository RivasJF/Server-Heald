
export class DoctorServiceStatus {
  private readonly id?: string;
  private readonly doctorId: string;
  private active: boolean;
  private readonly updatedAt?: Date;

  private constructor(
    doctorId: string,
    active = true,
    id?: string,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.doctorId = doctorId;
    this.active = active;
    this.updatedAt = updatedAt;
  }

  static create(
    doctorId: string,
    active = true,
    id?: string,
    updatedAt?: Date,
  ) {
    if (!doctorId || doctorId.trim().length === 0) {
      throw new Error('Doctor id is required');
    }

    return new DoctorServiceStatus(doctorId, active, id, updatedAt);
  }

  activeStatus() {
    this.active = true;
  }

  deactivateStatus() {
    this.active = false;
  }

  getId() {
    return this.id;
  }

  getDoctorId() {
    return this.doctorId;
  }

  getActive() {
    return this.active;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }
}
