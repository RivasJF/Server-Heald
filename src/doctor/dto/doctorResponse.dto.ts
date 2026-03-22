import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsDate, IsUUID } from 'class-validator';

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
    description: "Doctor's full name",
    example: 'Dr. John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Doctor's email address",
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Doctor's phone number",
    example: '+12133734253',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    description: "Doctor's birth date",
    example: '1980-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  birthDate?: Date;

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

  createdAt?: Date;

  updatedAt?: Date;
}
