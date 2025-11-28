import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ){}

    async login(loginDto: LoginDto){
        const user = await this.userService.findByEmail(loginDto.email);

        const isMatch = loginDto.password === user.password;

        if(!isMatch){
            throw new UnauthorizedException('Password incorrect')
        }

        const payload: JwtPayload = { 
            sub: user.id, 
            email: user.email, 
            role: user.role
        };

        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user
        }
    }
}
