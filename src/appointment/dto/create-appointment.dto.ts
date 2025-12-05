import { IsISO8601, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  doctorId: string;

  @IsString()
  patientId: string;

  @IsString()
  clinicLocationId: string;

  @IsISO8601()
  startTime: string;

  @IsISO8601()
  endTime: string;
}