import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsDate, IsUUID } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

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

  constructor(data: Partial<DoctorResponseDto>) {
    Object.assign(this, data);
  }
}
