import { IsString, Matches, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BreakDto {
  @ApiProperty({
    description: 'Day of the week for the break',
    enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  })
  @IsString()
  @IsIn(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])
  day: string;

  @ApiProperty({
    description: 'Start time of the break in HH:mm format',
    example: '13:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be HH:mm',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time of the break in HH:mm format',
    example: '14:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'endTime must be HH:mm' })
  endTime: string;
}