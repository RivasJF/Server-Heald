import { DoctorDayCloseResponseDto } from '../dto/doctor-day-closeResponse.dto';
import { DoctorDayClose } from '../entities/doctor-day-close.entity';

export class DoctorDayCloseMapper {
  static toDto(entity: DoctorDayClose): DoctorDayCloseResponseDto {
    return new DoctorDayCloseResponseDto({
      id: entity.getId() ?? '',
      doctorId: entity.getDoctorId(),
      date: entity.getDate().toISOString(),
      closedAt: entity.getClosedAt(),
      createdAt: entity.getCreatedAt()?.toISOString() ?? new Date().toISOString(),
    });
  }

  static toDtoList(entities: DoctorDayClose[]): DoctorDayCloseResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
