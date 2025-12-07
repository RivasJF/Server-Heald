import { IsDateString, IsString, Matches } from 'class-validator';

export class CreateDayCloseDto {
  @IsDateString()
  date: string;

  @IsString()
    // formato 24h HH:mm
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'startTime must be HH:mm',
    })
  closedAt: string;
}
