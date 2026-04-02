import { ApiProperty } from '@nestjs/swagger';

export class ScheduleBreakResponseDto {
  @ApiProperty({ example: 'cm8z1xk2m0003s5u8f1d9w6y2' })
  id: string;

  @ApiProperty({ example: 'cm8z1xk2m0000s5u8n4p7q9r1' })
  scheduleId: string;

  @ApiProperty({ enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] })
  day: string;

  @ApiProperty({ example: '13:00' })
  startTime: string;

  @ApiProperty({ example: '14:00' })
  endTime: string;
}