import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginUseCase } from './use-cases/login.use-case';
import { GetProfileUseCase } from './use-cases/get-profile.use-case';

@Injectable()
export class AuthService {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly getProfileUseCase: GetProfileUseCase,
    ) {}

    async login(loginDto: LoginDto) {
        return this.loginUseCase.execute(loginDto);
    }

    async getProfile(userId: string) {
        return this.getProfileUseCase.execute(userId);
    }
}
