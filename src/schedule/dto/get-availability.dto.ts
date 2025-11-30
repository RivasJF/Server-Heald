import { IsDateString } from 'class-validator';

export class GetAvailabilityDto {
  @IsDateString()
  date: string; // YYYY-MM-DD (se usa solo la parte fecha)
}
