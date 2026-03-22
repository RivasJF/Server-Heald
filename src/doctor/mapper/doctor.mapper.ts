import { DoctorResponseDto } from "../dto/doctorResponse.dto";
import { Doctor } from "../entities/doctor.entity";

export function toDto(doctor: Doctor) {
    const dto = new DoctorResponseDto();
    dto.id = doctor.getId()!;
    dto.userId = doctor.getUserId();
    dto.speciality = doctor.getSpeciality();
    dto.biography = doctor.getBiography();
    dto.createdAt = doctor.getCreatedAt();
    dto.updatedAt = doctor.getUpdatedAt();
    return dto;
}