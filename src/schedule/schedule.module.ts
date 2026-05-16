import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { GetScheduleByUserIdUseCase } from './use-cases/get-schedule-by-user-id.use-case';
import { ScheduleRepository } from './repositories/schedule.repository';
import { CreateScheduleUseCase } from './use-cases/create-schedule.use-case';
import { UpdateScheduleUseCase } from './use-cases/update-schedule.use-case';
import { DoctorModule } from 'src/doctor/doctor.module';

@Module({
  imports: [DoctorModule],
  controllers: [ScheduleController],
  providers: [
    GetScheduleByUserIdUseCase,
    CreateScheduleUseCase,
    UpdateScheduleUseCase,
    {
      provide: 'IScheduleRepository',
      useClass: ScheduleRepository,
    },
  ],
  exports: ['IScheduleRepository'],
})
export class ScheduleModule {}
