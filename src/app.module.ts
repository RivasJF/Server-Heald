import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ClinicModule } from './clinic/clinic.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorStatusModule } from './doctor-status/doctor-status.module';
import { EmailSenderModule } from './email-sender/email-sender.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    UserModule,
    DoctorModule,
    AuthModule,
    ScheduleModule,
    ClinicModule,
    AppointmentModule,
    DoctorStatusModule,
    EmailSenderModule,
  ],
})
export class AppModule {}
