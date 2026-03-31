import { Inject, Injectable} from '@nestjs/common';
import { IDoctorRepository } from '../repositories/doctor.repository.imp';
import { DoctorMapper } from '../mapper/doctor.mapper';

@Injectable()
export class GetAllDoctorUseCase {
  constructor(
    @Inject('IDoctorRepository')
    private readonly doctorRepo: IDoctorRepository,
  ) {}

  async execute() {
    const doctors = await this.doctorRepo.findMany();
    return doctors.map((doctor) => DoctorMapper.toDto(doctor));
  }
}
