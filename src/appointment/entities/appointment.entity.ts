export type UpdateAppointmentData = {
  startTime?: Date;
  endTime?: Date;
};

export class Appointment {
  private readonly id?: string;
  private readonly doctorId: string;
  private readonly patientId: string;
  private readonly clinicLocationId: string;
  private startTime: Date;
  private endTime: Date;
  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;

  private constructor(
    doctorId: string,
    patientId: string,
    clinicLocationId: string,
    startTime: Date,
    endTime: Date,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.doctorId = doctorId;
    this.patientId = patientId;
    this.clinicLocationId = clinicLocationId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    doctorId: string,
    patientId: string,
    clinicLocationId: string,
    startTime: Date,
    endTime: Date,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    if (!doctorId || doctorId.trim().length === 0) {
      throw new Error('Doctor id is required');
    }

    if (!patientId || patientId.trim().length === 0) {
      throw new Error('Patient id is required');
    }

    if (!clinicLocationId || clinicLocationId.trim().length === 0) {
      throw new Error('Clinic location id is required');
    }

    if (!(startTime instanceof Date) || Number.isNaN(startTime.getTime())) {
      throw new Error('Start time is invalid');
    }

    if (!(endTime instanceof Date) || Number.isNaN(endTime.getTime())) {
      throw new Error('End time is invalid');
    }

    if (endTime <= startTime) {
      throw new Error('End time must be greater than start time');
    }

    return new Appointment(
      doctorId,
      patientId,
      clinicLocationId,
      startTime,
      endTime,
      id,
      createdAt,
      updatedAt,
    );
  }

  updateData(updateData: UpdateAppointmentData) {
    const nextStart = updateData.startTime ?? this.startTime;
    const nextEnd = updateData.endTime ?? this.endTime;

    if (nextEnd <= nextStart) {
      throw new Error('End time must be greater than start time');
    }

    if (updateData.startTime !== undefined) {
      if (
        !(updateData.startTime instanceof Date) ||
        Number.isNaN(updateData.startTime.getTime())
      ) {
        throw new Error('Start time is invalid');
      }
      this.startTime = updateData.startTime;
    }

    if (updateData.endTime !== undefined) {
      if (
        !(updateData.endTime instanceof Date) ||
        Number.isNaN(updateData.endTime.getTime())
      ) {
        throw new Error('End time is invalid');
      }
      this.endTime = updateData.endTime;
    }
  }

  getId() {
    return this.id;
  }

  getDoctorId() {
    return this.doctorId;
  }

  getPatientId() {
    return this.patientId;
  }

  getClinicLocationId() {
    return this.clinicLocationId;
  }

  getStartTime() {
    return this.startTime;
  }

  getEndTime() {
    return this.endTime;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }
}
