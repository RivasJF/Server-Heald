import {
  IsInt,
  Min,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayDto } from './day.dto';
import { BreakDto } from './break.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorScheduleDto {
  @ApiProperty({
    description: 'Duration of each consultation in minutes',
    example: 30,
  })
  @IsInt()
  @Min(5)
  consultationTime: number; // minutos

  @ApiProperty({ type: [DayDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DayDto)
  days: DayDto[];

  @ApiProperty({ type: [BreakDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakDto)
  breaks?: BreakDto[];
}