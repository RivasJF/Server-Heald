import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentMapper } from '../mapper/appointment.mapper';
import { IAppointmentRepository } from '../repository/appointment.repository.imp';

@Injectable()
export class CancelAppointmentUseCase {
  constructor(
    @Inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(appointmentId: string) {
    const appointment = await this.appointmentRepository.findById(appointmentId);

    if (!appointment) {
      throw new NotFoundException(
        `Cita con id ${appointmentId} no encontrada`,
      );
    }

    await this.appointmentRepository.delete(appointmentId);

    return AppointmentMapper.toDto(appointment);
  }
}