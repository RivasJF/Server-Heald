import { IsDateString } from 'class-validator';

export class CreateDayCloseDto {
  @IsDateString()
  closedAt: string;
}
