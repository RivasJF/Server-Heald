import { DoctorResponseDto } from "../dto/doctorResponse.dto";
import { Doctor } from "../entities/doctor.entity";

export class DoctorMapper {
    static toDto(doctor: Doctor): DoctorResponseDto {
        return new DoctorResponseDto({
            id: doctor.getId(),
            userId: doctor.getUserId(),
            speciality: doctor.getSpeciality(),
            biography: doctor.getBiography(),
            createdAt: doctor.getCreatedAt()?.toISOString(),
            updatedAt: doctor.getUpdatedAt()?.toISOString(),
        });
    }
}