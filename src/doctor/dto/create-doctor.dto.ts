import { IsString, IsOptional, IsInt, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({ description: 'User ID of the doctor', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Speciality of the doctor', example: 'Sexologia' })
  @IsOptional()
  @IsString()
  speciality?: string;

  @ApiProperty({ description: 'Biography of the doctor', example: 'Master en el Trenzado' })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiProperty({ description: 'Consultation time of the doctor', example: 30 })
  @IsOptional()
  @IsInt()
  @Min(5)
  consultationTime?: number;
}