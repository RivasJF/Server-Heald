import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Matches } from 'class-validator';

export class CreateDayCloseDto {
  @ApiProperty({ example: '2025-12-12' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '14:30' })
  @IsString()
    // formato 24h HH:mm
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'startTime must be HH:mm',
    })
  closedAt: string;
}
