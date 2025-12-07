import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'clxmilx2h000078ylk03oya0g' })
  @IsString()
  doctorId: string;

  @ApiProperty({ example: 'clxmikz91000078yl82i9wc2s' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'clxmilx2h000078ylk03oya0g' })
  @IsString()
  clinicLocationId: string;

  @ApiProperty({ example: '2025-12-12T10:00:00.000Z' })
  @IsISO8601()
  startTime: string;

  @ApiProperty({ example: '2025-12-12T10:30:00.000Z' })
  @IsISO8601()
  endTime: string;
}