import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ClinicModule } from './clinic/clinic.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true}), UserModule, DoctorModule, AuthModule, ScheduleModule, ClinicModule, AppointmentModule],
})
export class AppModule {}
