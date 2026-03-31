import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsDate, IsUUID } from 'class-validator';
import { UserResponseDto } from 'src/user/dto/userResponse.dto';
import { DoctorServiceStatusResponseDto } from 'src/doctor-status/dto/doctor-service-statusResponse.dto';

export class DoctorResponseDto {
  @ApiProperty({
    description: "Doctor's unique identifier",
    example: 'clxvz4x0a000008l3b1a2c3d4',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "The user's unique identifier associated with the doctor",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: "Doctor's speciality",
    example: 'Cardiology',
    required: false,
  })
  @IsOptional()
  @IsString()
  speciality?: string;

  @ApiProperty({
    description: "Doctor's biography",
    example: 'An experienced cardiologist with over 15 years of practice.',
    required: false,
  })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiProperty({
    description: "Doctor's creation date",
    example: '2026-03-31T19:41:08.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: "Doctor's last update date",
    example: '2026-03-31T20:10:00.000Z',
  })
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Associated user data for this doctor',
    type: () => UserResponseDto,
  })
  user?: UserResponseDto;

  @ApiPropertyOptional({
    description: 'Estado de servicio actual del doctor',
    type: () => DoctorServiceStatusResponseDto,
    nullable: true,
  })
  serviceStatus?: DoctorServiceStatusResponseDto;

  constructor(data: Partial<DoctorResponseDto>) {
    Object.assign(this, data);
  }
}
