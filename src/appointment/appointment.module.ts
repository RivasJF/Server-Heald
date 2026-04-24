import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentRepository } from './repository/appointment.repository';
import { FindAppointmentsByPatientUseCase } from './use-case/find-appointments-by-patient.use-case';
import { FindAppointmentsByDoctorUseCase } from './use-case/find-appointments-by-doctor.use-case';
import { GenerateAvailabilityUseCase } from './use-case/generate-availability.use-case';
import { CancelAppointmentUseCase } from './use-case/cancel-appointment.use-case';
import { CreateAppointmentUseCase } from './use-case/create-appointment.use-case';
import { DoctorModule } from 'src/doctor/doctor.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { ClinicModule } from 'src/clinic/clinic.module';
import { DoctorStatusModule } from 'src/doctor-status/doctor-status.module';
import { FindAppointmentsByPatientPaginationUseCase } from './use-case/find-appointment-by-patient-pagination.use-case';
import { FindAppointmentsByDoctorPaginationUseCase } from './use-case/find-appointments-by-doctor-pagination.use-case';

@Module({
  imports: [DoctorModule, ScheduleModule, ClinicModule, DoctorStatusModule],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    FindAppointmentsByPatientUseCase,
    FindAppointmentsByPatientPaginationUseCase,
    FindAppointmentsByDoctorUseCase,
    GenerateAvailabilityUseCase,
    CancelAppointmentUseCase,
    CreateAppointmentUseCase,
    FindAppointmentsByDoctorPaginationUseCase,
    {
      provide: 'IAppointmentRepository',
      useClass: AppointmentRepository,
    },
  ],
})
export class AppointmentModule {}
