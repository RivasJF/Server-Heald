import { IsString, IsDateString } from 'class-validator';

export class CreateDayOffDto {
  @IsDateString()
  date: string;
}
