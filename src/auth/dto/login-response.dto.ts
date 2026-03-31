import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dto/userResponse.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT Access Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;
}