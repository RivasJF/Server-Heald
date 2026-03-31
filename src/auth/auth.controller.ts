import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { LoginDto } from './dto/loginRequest.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserResponseDto } from 'src/user/dto/userResponse.dto';
import { LoginUseCase } from './use-cases/login.use-case';
import { GetProfileUseCase } from './use-cases/get-profile.use-case';
import { AuthRequest } from './interfaces/auth-request.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Successful login, returns access token and user information',
    type: LoginResponseDto,
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
    status: 200,
    description: 'Current authenticated user profile',
    type: UserResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: AuthRequest) {
    return this.getProfileUseCase.execute(req);
  }
}
