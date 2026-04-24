import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { ClinicRepository } from './repository/clinic.repository';
import { FindAllClinicUseCase } from './use-case/find-all-clinic.use-case';
import { CreateClinicUseCase } from './use-case/create-clinic.use-case';
import { FindOneClinicUseCase } from './use-case/find-one-clinic.use-case';
import { UpdateClinicUseCase } from './use-case/update-clinic.use-case';
import { RemoveClinicUseCase } from './use-case/remove-clinic.use-case';
import { FindNearbyClinicUseCase } from './use-case/find-nearby-clinic.use-case';
import { DoctorModule } from 'src/doctor/doctor.module';
import { FindNearbyClinicPaginationUseCase } from './use-case/find-nearby-clinic-pagination.use-case';

@Module({
  imports: [DoctorModule],
  controllers: [ClinicController],
  providers: [
    ClinicService,
    FindAllClinicUseCase,
    CreateClinicUseCase,
    FindOneClinicUseCase,
    UpdateClinicUseCase,
    RemoveClinicUseCase,
    FindNearbyClinicUseCase,
    FindNearbyClinicPaginationUseCase,
    {
      provide: 'IClinicRepository',
      useClass: ClinicRepository,
    },
  ],
  exports: ['IClinicRepository'],
})
export class ClinicModule {}
