import { Inject, Injectable } from '@nestjs/common';
import { AppointmentResponseDto } from '../dto/appointmentResponse.dto';
import { AppointmentMapper } from '../mapper/appointment.mapper';
import { IAppointmentRepository } from '../repository/appointment.repository.imp';

@Injectable()
export class FindAppointmentsByPatientUseCase {
  constructor(
    @Inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(patientId: string,page: number, pageSize: number): Promise<AppointmentResponseDto[]> {
    const appointments = await this.appointmentRepository.findByPatientId(
      patientId,
      page,
      pageSize
    );

    return appointments.map((appointment) =>
      AppointmentMapper.toPatientDto(appointment),
    );
  }
}
