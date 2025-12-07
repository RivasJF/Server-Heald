import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class CreateDayOffDto {
  @ApiProperty({ example: '2025-12-12' })
  @IsDateString()
  date: string;
}
