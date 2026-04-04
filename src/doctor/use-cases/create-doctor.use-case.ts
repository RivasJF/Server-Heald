import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDoctorRepository } from '../repositories/doctor.repository.imp';
import { CreateDoctorDto } from '../dto/doctorCreateRequest.dto';
import { Doctor } from '../entities/doctor.entity';
import { IUserRepository } from 'src/user/repositories/user.repository.imp';
import { DoctorMapper } from '../mapper/doctor.mapper';
import { IDoctorServiceStatusRepository } from 'src/doctor-status/repository/doctor-service-status.repository.imp';
import { DoctorServiceStatus } from 'src/doctor-status/entities/doctor-service-status.entity';

@Injectable()
export class CreateDoctorUseCase {
  constructor(
    @Inject('IDoctorRepository')
    private readonly doctorRepo: IDoctorRepository,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IDoctorServiceStatusRepository')
    private readonly doctorServiceStatusRepo: IDoctorServiceStatusRepository,
  ) {}

  async execute(createDoctorDto: CreateDoctorDto) {
    const existing = await this.userRepo.findById(createDoctorDto.userId);
    if (!existing) {
      throw new NotFoundException(
        `User con id ${createDoctorDto.userId} no encontrado`,
      );
    }
    const doctor = Doctor.create(
      createDoctorDto.userId,
      createDoctorDto.speciality,
      createDoctorDto.biography,
    );
    const newDoctor = await this.doctorRepo.save(doctor);

    const serviceStatus = DoctorServiceStatus.create(newDoctor.getId()!, false);

    await this.doctorServiceStatusRepo.save(serviceStatus);

    return DoctorMapper.toDto(newDoctor);
  }
}
