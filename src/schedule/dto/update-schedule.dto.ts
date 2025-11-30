// src/doctor-schedule/dto/update-doctor-schedule.dto.ts (Revisión)
import {
  IsInt,
  IsArray,
  ValidateNested,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayDto } from './day.dto';
import { BreakDto } from './break.dto';

export class UpdateDoctorScheduleDto {
  @IsOptional()
  @IsInt()
  @Min(5)
  consultationTime?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayDto)
  days?: DayDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakDto)
  breaks?: BreakDto[];
}