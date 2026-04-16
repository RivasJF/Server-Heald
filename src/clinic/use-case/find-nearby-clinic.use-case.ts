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
    const deltaLatitude =(radius / 1000) / 111;
    const deltaLongitude = (radius / 1000) / (111 * (Math.cos(Math.round(lat *100)/100)));

    return {
      minLatitude: lat - deltaLatitude,
      maxLatitude: lat + deltaLatitude,
      minLongitude: lng - deltaLongitude,
      maxLongitude: lng + deltaLongitude,
    };
  }
}
