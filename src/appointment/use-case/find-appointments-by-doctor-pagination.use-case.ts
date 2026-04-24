import { Inject, Injectable } from '@nestjs/common';
import { AppointmentResponseDto } from '../dto/appointmentResponse.dto';
import { AppointmentMapper } from '../mapper/appointment.mapper';
import { IAppointmentRepository } from '../repository/appointment.repository.imp';
import { AppointmentDoctorResponseDto } from '../dto/appintment-doctorResponse.dto';

@Injectable()
export class FindAppointmentsByDoctorPaginationUseCase {
  constructor(
    @Inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(doctorId: string, page: number, pageSize: number): Promise<AppointmentDoctorResponseDto[]> {
    const appointments = await this.appointmentRepository.findByDoctorIdPagination(
      doctorId,
      page,
      pageSize
    );

    return appointments.map((appointment) =>
      AppointmentMapper.toDoctorDto(appointment),
    );
  }
}