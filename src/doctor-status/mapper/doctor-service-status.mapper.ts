import { DoctorServiceStatus as DoctorServiceStatusSchema } from 'generated/prisma';
import { DoctorServiceStatus } from '../entities/doctor-service-status.entity';
import { DoctorServiceStatusResponseDto } from '../dto/doctor-service-statusResponse.dto';

export class DoctorServiceStatusMapper {
  static toDomain(data: DoctorServiceStatusSchema): DoctorServiceStatus {
    return DoctorServiceStatus.create(
      data.doctorId,
      data.active,
      data.id,
      data.updatedAt,
    );
  }

  static toDto(entity: DoctorServiceStatus): DoctorServiceStatusResponseDto {
    return new DoctorServiceStatusResponseDto({
      id: entity.getId() ?? '',
      doctorId: entity.getDoctorId(),
      active: entity.getActive(),
      updatedAt: entity.getUpdatedAt()?.toISOString() ?? new Date().toISOString(),
    });
  }
}
