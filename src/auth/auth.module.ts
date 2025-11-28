import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[
    UserModule, 
    PassportModule,
    JwtModule.register({
    secret: process.env.JWT_SECRET || 'dev-secret',
    signOptions: { expiresIn: '30d' },
  })],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
