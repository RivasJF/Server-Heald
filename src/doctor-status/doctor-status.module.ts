import { Module } from '@nestjs/common';
import { DoctorStatusService } from './doctor-status.service';
import { DoctorStatusController } from './doctor-status.controller';

@Module({
  controllers: [DoctorStatusController],
  providers: [DoctorStatusService],
})
export class DoctorStatusModule {}
