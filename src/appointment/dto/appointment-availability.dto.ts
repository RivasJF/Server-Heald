import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

class AvailableSlotDto {
  @ApiProperty({ example: '09:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be HH:mm',
  })
  start: string;

  @ApiProperty({ example: '09:30' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be HH:mm',
  })
  end: string;
}

export class AppointmentAvailabilityDto {
  @ApiProperty({ example: '2025-12-12' })
  @IsDateString()
  date: string;

  @ApiProperty({ type: [AvailableSlotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableSlotDto)
  available: AvailableSlotDto[];
}
