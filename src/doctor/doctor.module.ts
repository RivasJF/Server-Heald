import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { CreateDoctorUseCase } from './use-cases/create-doctor.use-case';
import { DoctorRepository } from './repositories/doctor.repository';
import { UserModule } from 'src/user/user.module';
import { GetAllDoctorUseCase } from './use-cases/get-all-doctor.use-case';

@Module({
  imports: [
    UserModule
    ],
  controllers: [DoctorController],
  providers: [
    DoctorService, 
    CreateDoctorUseCase,
    GetAllDoctorUseCase,
    {
      provide: 'IDoctorRepository',
      useClass: DoctorRepository
    }
  ],
})
export class DoctorModule {}
