import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true}), UserModule, DoctorModule],
})
export class AppModule {}
