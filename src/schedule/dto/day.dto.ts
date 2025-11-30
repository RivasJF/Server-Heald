import { IsIn, IsString, Matches } from 'class-validator';

export class DayDto {
  @IsString()
  @IsIn(['MON','TUE','WED','THU','FRI','SAT','SUN'])
  day: string;

  @IsString()
  // formato 24h HH:mm
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'startTime must be HH:mm' })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'endTime must be HH:mm' })
  endTime: string;
}
