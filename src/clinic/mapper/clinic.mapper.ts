import { ClinicResponseDto } from '../dto/clinicResponse.dto';
import { Clinic } from '../entities/clinic.entity';

export class ClinicMapper {
  static toDto(clinic: Clinic): ClinicResponseDto {
    return new ClinicResponseDto({
      id: clinic.getId()!,
      latitude: clinic.getLatitude(),
      longitude: clinic.getLongitude(),
      address: clinic.getAddress(),
      doctorId: clinic.getDoctorId(),
      createdAt: clinic.getCreatedAt()!,
      updatedAt: clinic.getUpdatedAt()!,
    });
  }
}
