import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentRepository } from './repository/appointment.repository';
import { FindAppointmentsByPatientUseCase } from './use-case/find-appointments-by-patient.use-case';
import { FindAppointmentsByDoctorUseCase } from './use-case/find-appointments-by-doctor.use-case';

@Module({
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    FindAppointmentsByPatientUseCase,
    FindAppointmentsByDoctorUseCase,
    {
      provide: 'IAppointmentRepository',
      useClass: AppointmentRepository,
    },
  ],
})
export class AppointmentModule {}
