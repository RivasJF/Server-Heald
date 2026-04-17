import { ClinicNearResponseDto } from '../dto/clinicNearResponse.dto';
import { ClinicResponseDto } from '../dto/clinicResponse.dto';
import { Clinic } from '../entities/clinic.entity';
import { DoctorMapper } from 'src/doctor/mapper/doctor.mapper';

export class ClinicMapper {
  static toDto(clinic: Clinic): ClinicResponseDto {
    return new ClinicResponseDto({
      id: clinic.getId()!,
      latitude: clinic.getLatitude(),
      longitude: clinic.getLongitude(),
      address: clinic.getAddress(),
      doctorId: clinic.getDoctorId(),
      createdAt: clinic.getCreatedAt().toISOString(),
      updatedAt: clinic.getUpdatedAt().toISOString(),
    });
  }

  static toNearDto(clinic: Clinic): ClinicNearResponseDto {
    return new ClinicNearResponseDto({
      id: clinic.getId()!,
      latitude: clinic.getLatitude(),
      longitude: clinic.getLongitude(),
      address: clinic.getAddress(),
      doctorId: clinic.getDoctorId(),
      createdAt: clinic.getCreatedAt().toISOString(),
      updatedAt: clinic.getUpdatedAt().toISOString(),
      doctor: clinic.getDoctor() ? DoctorMapper.toDto(clinic.getDoctor()) : undefined,
    });
  }
}
