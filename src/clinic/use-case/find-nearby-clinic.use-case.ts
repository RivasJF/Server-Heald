import { Inject, Injectable } from '@nestjs/common';
import { Clinic } from '../entities/clinic.entity';
import { ClinicMapper } from '../mapper/clinic.mapper';
import { IClinicRepository } from '../repository/clinic.repository.imp';

@Injectable()
export class FindNearbyClinicUseCase {
  private static readonly EARTH_RADIUS_IN_METERS = 6371e3;

  constructor(
    @Inject('IClinicRepository')
    private readonly clinicRepository: IClinicRepository,
  ) {}

  async execute(lat: number, lng: number, radius = 5000) {
    const { minLatitude, maxLatitude, minLongitude, maxLongitude } =
      this.getBoundingBox(lat, lng, radius);

    const candidateClinics = await this.clinicRepository.findByCoordinatesRange(
      minLatitude,
      maxLatitude,
      minLongitude,
      maxLongitude,
    );

    return candidateClinics
      .map((clinic) => {
        const distance = Clinic.getDistance(
          lat,
          lng,
          clinic.getLatitude(),
          clinic.getLongitude(),
        );

        return {
          ...ClinicMapper.toDto(clinic),
          distance,
        };
      })
      .filter((clinic) => clinic.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }

  private getBoundingBox(lat: number, lng: number, radius: number) {
    const latRadians = (lat * Math.PI) / 180;
    const deltaLatitude =
      (radius / FindNearbyClinicUseCase.EARTH_RADIUS_IN_METERS) *
      (180 / Math.PI);

    const cosLatitude = Math.cos(latRadians);
    const safeCosLatitude = Math.abs(cosLatitude) < 1e-12 ? 1e-12 : cosLatitude;
    const deltaLongitude =
      (radius /
        (FindNearbyClinicUseCase.EARTH_RADIUS_IN_METERS * safeCosLatitude)) *
      (180 / Math.PI);

    return {
      minLatitude: lat - deltaLatitude,
      maxLatitude: lat + deltaLatitude,
      minLongitude: lng - deltaLongitude,
      maxLongitude: lng + deltaLongitude,
    };
  }
}
