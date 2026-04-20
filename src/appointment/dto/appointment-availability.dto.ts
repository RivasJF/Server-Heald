import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class AvailableSlotDto {
  @ApiProperty({ example: '2026-04-18T09:00:00.000Z' })
  @IsDateString()
  start: string;

  @ApiProperty({ example: '2026-04-18T09:30:00.000Z' })
  @IsDateString()
  end: string;
}

export class AppointmentAvailabilityDto {
  @ApiProperty({ example: '2026-04-18' })
  @IsString()
  date: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  totalSlots: number;

  @ApiProperty({ example: 14 })
  @IsNumber()
  availableSlots: number;

  @ApiPropertyOptional({ example: 'cm8z1xk2m0003s5u8f1d9w6y2' })
  @IsOptional()
  @IsString()
  clinicLocationId?: string;

  @ApiProperty({ type: [AvailableSlotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableSlotDto)
  available: AvailableSlotDto[];

  @ApiPropertyOptional({ example: 'El doctor no atenderá este día' })
  @IsOptional()
  @IsString()
  message?: string;

  constructor(data: Partial<AppointmentAvailabilityDto>) {
    Object.assign(this, data);
  }
}
