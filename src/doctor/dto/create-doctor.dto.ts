import { IsString, IsOptional, IsInt, Min, IsUUID } from 'class-validator';

export class CreateDoctorDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  speciality?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  consultationTime?: number;
}