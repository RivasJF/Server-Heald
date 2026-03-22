import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDoctorRepository } from '../repositories/doctor.repository.imp';
import { CreateDoctorDto } from '../dto/doctorCreateRequest.dto';
import { Doctor } from '../entities/doctor.entity';
import { DoctorResponseDto } from '../dto/doctorResponse.dto';
import { IUserRepository } from 'src/user/repositories/user.repository.imp';

@Injectable()
export class CreateDoctorUseCase {
  constructor(
    @Inject('IDoctorRepository')
    private readonly doctorRepo: IDoctorRepository,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(createDoctorDto: CreateDoctorDto) {
    const existing = await this.userRepo.findById(createDoctorDto.userId);
    if (!existing) {
      throw new NotFoundException(
        `User con id ${createDoctorDto.userId} no encontrado`,
      );
    }
    const doctor = new Doctor(
      createDoctorDto.userId,
      createDoctorDto.speciality,
      createDoctorDto.biography,
    );
    const newDoctor = await this.doctorRepo.save(doctor);

    await this.doctorRepo.createStatus(newDoctor.getId()!);

    const response = new DoctorResponseDto();
    response.id = newDoctor.getId()!;
    response.userId = newDoctor.getUserId();
    response.speciality = newDoctor.getSpeciality();
    response.biography = newDoctor.getBiography();
    response.createdAt = newDoctor.getCreatedAt();
    response.updatedAt = newDoctor.getUpdatedAt();
    return response;
  }
}
