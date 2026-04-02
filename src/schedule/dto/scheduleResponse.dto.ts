import { ApiProperty } from '@nestjs/swagger';
import { ScheduleBreakResponseDto } from './breackResponse.dto';
import { ScheduleDayResponseDto } from './daysResponse.dto';

export class ScheduleResponseDto {
  @ApiProperty({ example: 'cm8z1xk2m0000s5u8n4p7q9r1' })
  id: string;

  @ApiProperty({ example: 'cm8z1xk2m0001s5u8j2h6t4v0' })
  doctorId: string;

  @ApiProperty({ example: 30, description: 'Duration in minutes per consultation' })
  consultationTime: number;

  @ApiProperty({ example: '2026-04-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-01T12:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: [ScheduleDayResponseDto] })
  days: ScheduleDayResponseDto[];

  @ApiProperty({ type: [ScheduleBreakResponseDto] })
  breaks: ScheduleBreakResponseDto[];
}