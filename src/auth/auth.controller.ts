import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponse } from './interfaces/jwt-payload.interface';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Successful login, returns access token and user information',
    type: LoginResponseDto,
  })
  @Post('login')
  login(@Body() loginDto: LoginDto):Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }
}
