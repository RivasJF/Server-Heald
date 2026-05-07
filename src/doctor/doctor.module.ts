import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { CreateDoctorUseCase } from './use-cases/create-doctor.use-case';
import { DoctorRepository } from './repositories/doctor.repository';
import { UserModule } from 'src/user/user.module';
import { GetAllDoctorUseCase } from './use-cases/get-all-doctor.use-case';
import { GetDoctorByIdUseCase } from './use-cases/get-doctor-by-id.use-case';
import { GetDoctorByUserIdUseCase } from './use-cases/get-doctor-by-user-id.use-case';
import { UpdateDoctorUseCase } from './use-cases/update-doctor.use-case';
import { DeleteDoctorUseCase } from './use-cases/delete-doctor.use-case';
import { DoctorStatusModule } from 'src/doctor-status/doctor-status.module';

@Module({
  imports: [
    UserModule,
    DoctorStatusModule
    ],
  controllers: [DoctorController],
  providers: [
    CreateDoctorUseCase,
    GetAllDoctorUseCase,
    GetDoctorByIdUseCase,
    GetDoctorByUserIdUseCase,
    UpdateDoctorUseCase,
    DeleteDoctorUseCase,
    {
      provide: 'IDoctorRepository',
      useClass: DoctorRepository
    }
  ],
  exports: ['IDoctorRepository']
})
export class DoctorModule {}
