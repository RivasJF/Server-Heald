import { IsInt, Min, ValidateNested, IsArray, ArrayMinSize, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { DayDto } from './day.dto';
import { BreakDto } from './break.dto';

export class CreateDoctorScheduleDto {
  @IsInt()
  @Min(5)
  consultationTime: number; // minutos

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DayDto)
  days: DayDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakDto)
  breaks?: BreakDto[];
}
