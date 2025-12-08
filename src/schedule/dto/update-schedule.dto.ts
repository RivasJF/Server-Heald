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
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDoctorScheduleDto {
    @ApiPropertyOptional({ type: [DayDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DayDto)
    days?: DayDto[];

    @ApiPropertyOptional({ type: [BreakDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BreakDto)
    breaks?: BreakDto[];
}
