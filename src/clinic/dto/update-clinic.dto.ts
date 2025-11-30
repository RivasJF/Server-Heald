import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClinicDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsLatitude({ message: 'La latitud debe ser un valor de latitud geográfico válido.' })
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsLongitude({ message: 'La longitud debe ser un valor de longitud geográfico válido.' })
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @Length(5, 255, { message: 'La dirección debe tener entre 5 y 255 caracteres.' })
  address?: string;

  // El doctorId generalmente no se debería actualizar directamente
  // si la relación es gestionada por otro proceso, pero se incluye por completitud.
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El doctorId debe ser un string.' })
  doctorId?: string;
}