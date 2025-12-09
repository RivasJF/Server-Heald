import { IsNumber, IsOptional, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetNearbyClinicsDto {
  @ApiProperty({ description: 'Latitude of the user', type: Number })
  @IsDefined()
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Longitude of the user', type: Number })
  @IsDefined()
  @IsNumber()
  lng: number;

  @ApiProperty({ description: 'Search radius in meters (default: 5000)', type: Number, required: false })
  @IsOptional()
  @IsNumber()
  radius?: number = 5000;
}