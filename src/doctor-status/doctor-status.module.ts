import { Module } from '@nestjs/common';
import { DoctorStatusController } from './doctor-status.controller';
import { DoctorDayOffRepository } from './repository/doctor-day-off.repository';
import { DoctorDayCloseRepository } from './repository/doctor-day-close.repository';
import { DoctorServiceStatusRepository } from './repository/doctor-service-status.repository';
import { GetAllDayOffsUseCase } from './use-cases/get-all-day-offs.use-case';
import { DeleteDayOffUseCase } from './use-cases/delete-day-off.use-case';
import { CreateDayOffUseCase } from './use-cases/create-day-off.use-case';
import { CreateDayCloseUseCase } from './use-cases/create-day-close.use-case';
import { DeleteDayCloseUseCase } from './use-cases/delete-day-close.use-case';
import { SetServiceStatusUseCase } from './use-cases/set-service-status.use-case';

@Module({
  controllers: [DoctorStatusController],
  providers: [
    CreateDayOffUseCase,
    CreateDayCloseUseCase,
    GetAllDayOffsUseCase,
    DeleteDayOffUseCase,
    DeleteDayCloseUseCase,
    SetServiceStatusUseCase,
    {
      provide: 'IDoctorDayOffRepository',
      useClass: DoctorDayOffRepository,
    },
    {
      provide: 'IDoctorDayCloseRepository',
      useClass: DoctorDayCloseRepository,
    },
    {
      provide: 'IDoctorServiceStatusRepository',
      useClass: DoctorServiceStatusRepository,
    },
  ],
  exports: [
    'IDoctorServiceStatusRepository',
    'IDoctorDayOffRepository',
    'IDoctorDayCloseRepository',
  ],
})
export class DoctorStatusModule {}
