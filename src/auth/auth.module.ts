import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginUseCase } from './use-cases/login.use-case';
import { GetProfileUseCase } from './use-cases/get-profile.use-case';

@Module({
  imports:[
    UserModule, 
    PassportModule,
    JwtModule.register({
    secret: process.env.JWT_SECRET || 'dev-secret',
    signOptions: { expiresIn: '30d' },
  })],
  controllers: [AuthController],
  providers: [JwtStrategy, LoginUseCase, GetProfileUseCase],
})
export class AuthModule {}
