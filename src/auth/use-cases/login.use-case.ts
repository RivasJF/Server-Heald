import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { IUserRepository } from 'src/user/repositories/user.repository.imp';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(loginDto: LoginDto) {
    const normalizedEmail = loginDto.email.toLowerCase().trim();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user || user.getPassword() !== loginDto.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      sub: user.getId() ?? '',
      email: user.getEmail(),
      role: user.getRole(),
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        phoneNumber: user.getPhoneNumber(),
        birthDate: user.getBirthDate(),
        role: user.getRole(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      },
    };
  }
}
