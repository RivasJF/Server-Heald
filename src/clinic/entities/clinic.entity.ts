export type UpdateClinicData = {
  latitude?: number;
  longitude?: number;
  address?: string;
};

export class Clinic {
  private static readonly EARTH_RADIUS_IN_METERS = 6371e3;

  private readonly id?: string;
  private latitude: number;
  private longitude: number;
  private address: string;
  private readonly doctorId: string;
  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;

  private constructor(
    latitude: number,
    longitude: number,
    address: string,
    doctorId: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
    this.doctorId = doctorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    latitude: number,
    longitude: number,
    address: string,
    doctorId: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    if (!doctorId || doctorId.trim().length === 0) {
      throw new Error('Doctor id is required');
    }

    if (!address || address.trim().length === 0) {
      throw new Error('Address is required');
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude must be between -90 and 90');
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude must be between -180 and 180');
    }

    return new Clinic(
      latitude,
      longitude,
      address,
      doctorId,
      id,
      createdAt,
      updatedAt,
    );
  }

  static getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const lat1InRadians = (lat1 * Math.PI) / 180;
    const lat2InRadians = (lat2 * Math.PI) / 180;

    const deltaLatitudeInRadians = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLongitudeInRadians = ((lon2 - lon1) * Math.PI) / 180;

    const haversineCentralAngle =
      Math.pow(Math.sin(deltaLatitudeInRadians / 2), 2) +
      Math.cos(lat1InRadians) *
        Math.cos(lat2InRadians) *
        Math.pow(Math.sin(deltaLongitudeInRadians / 2), 2);

    const angularDistance =
      2 *
      Math.atan2(
        Math.sqrt(haversineCentralAngle),
        Math.sqrt(1 - haversineCentralAngle),
      );

    return Clinic.EARTH_RADIUS_IN_METERS * angularDistance;
  }

  updateData(updateData: UpdateClinicData) {
    if (updateData.latitude !== undefined) {
      if (updateData.latitude < -90 || updateData.latitude > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }
      this.latitude = updateData.latitude;
    }

    if (updateData.longitude !== undefined) {
      if (updateData.longitude < -180 || updateData.longitude > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }
      this.longitude = updateData.longitude;
    }

    if (updateData.address !== undefined) {
      if (!updateData.address || updateData.address.trim().length === 0) {
        throw new Error('Address is required');
      }
      this.address = updateData.address;
    }
  }

  getId() {
    return this.id;
  }

  getLatitude() {
    return this.latitude;
  }

  getLongitude() {
    return this.longitude;
  }

  getAddress() {
    return this.address;
  }

  getDoctorId() {
    return this.doctorId;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }
}
