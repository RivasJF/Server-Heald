import { IsString, Matches, IsIn } from 'class-validator';

export class BreakDto {
  @IsString()
  @IsIn(['MON','TUE','WED','THU','FRI','SAT','SUN'])
  day: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'startTime must be HH:mm' })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'endTime must be HH:mm' })
  endTime: string;
}
