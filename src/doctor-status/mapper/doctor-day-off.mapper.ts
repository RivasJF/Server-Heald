import { DoctorDayOffResponseDto } from '../dto/doctor-day-offResponse.dto';
import { DoctorDayOff } from '../entities/doctor-day-off.entity';

export class DoctorDayOffMapper {
  static toDto(entity: DoctorDayOff): DoctorDayOffResponseDto {
    return new DoctorDayOffResponseDto({
      id: entity.getId() ?? '',
      doctorId: entity.getDoctorId(),
      date: entity.getDate().toISOString(),
      createdAt: entity.getCreatedAt()?.toISOString() ?? new Date().toISOString(),
    });
  }

  static toDtoList(entities: DoctorDayOff[]): DoctorDayOffResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
