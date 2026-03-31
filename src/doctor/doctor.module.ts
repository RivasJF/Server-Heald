import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { CreateDoctorUseCase } from './use-cases/create-doctor.use-case';
import { DoctorRepository } from './repositories/doctor.repository';
import { UserModule } from 'src/user/user.module';
import { GetAllDoctorUseCase } from './use-cases/get-all-doctor.use-case';
import { GetDoctorByIdUseCase } from './use-cases/get-doctor-by-id.use-case';
import { GetDoctorByUserIdUseCase } from './use-cases/get-doctor-by-user-id.use-case';
import { UpdateDoctorUseCase } from './use-cases/update-doctor.use-case';
import { DeleteDoctorUseCase } from './use-cases/delete-doctor.use-case';

@Module({
  imports: [
    UserModule
    ],
  controllers: [DoctorController],
  providers: [
    DoctorService, 
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
})
export class DoctorModule {}
