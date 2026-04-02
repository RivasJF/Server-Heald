import { ApiProperty } from '@nestjs/swagger';

export class ScheduleDayResponseDto {
  @ApiProperty({ example: 'cm8z1xk2m0002s5u8b3n5m7k4' })
  id: string;

  @ApiProperty({ example: 'cm8z1xk2m0000s5u8n4p7q9r1' })
  scheduleId: string;

  @ApiProperty({ enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] })
  day: string;

  @ApiProperty({ example: '09:00' })
  startTime: string;

  @ApiProperty({ example: '17:00' })
  endTime: string; 
}