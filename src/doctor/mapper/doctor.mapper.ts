import { DoctorResponseDto } from '../dto/doctorResponse.dto';
import { Doctor } from '../entities/doctor.entity';
import { Doctor as DoctorSchema } from 'generated/prisma';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { DoctorServiceStatusMapper } from 'src/doctor-status/mapper/doctor-service-status.mapper';

export class DoctorMapper {
  static toDto(doctor: Doctor): DoctorResponseDto {
    return new DoctorResponseDto({
      id: doctor.getId(),
      userId: doctor.getUserId(),
      speciality: doctor.getSpeciality(),
      biography: doctor.getBiography(),
      createdAt: doctor.getCreatedAt()?.toISOString(),
      updatedAt: doctor.getUpdatedAt()?.toISOString(),
      user: doctor.getUser() ? UserMapper.toDto(doctor.getUser()) : undefined,
      serviceStatus: doctor.getServiceStatus()
        ? DoctorServiceStatusMapper.toDto(doctor.getServiceStatus())
        : undefined,
    });
  }

  static toDomain(data: DoctorSchema): Doctor {
    return Doctor.create(
      data.userId,
      data.speciality === null ? undefined : data.speciality,
      data.biography === null ? undefined : data.biography,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }
}
