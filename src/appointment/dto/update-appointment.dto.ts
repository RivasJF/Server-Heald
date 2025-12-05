import { IsOptional, IsEnum } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsEnum(['SCHEDULED', 'CANCELLED', 'COMPLETED'])
  status?: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
}
