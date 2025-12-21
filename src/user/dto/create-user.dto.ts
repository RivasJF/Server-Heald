import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
  IsEmail,
  IsPhoneNumber,
  IsDateString,
  IsDate,
} from 'class-validator';
import { $Enums } from 'generated/prisma';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'Chis',
    required: false,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'chis@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'strongpassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Phone number of the user in E.164 format',
    example: '+12133734253',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(undefined, {
    message: 'El número de teléfono debe ser un número de teléfono válido en formato E.164',
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Birth date of the user (Format: YYYY-MM-DD)',
    example: '2000-05-12',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: 'birthDate must be a valid date (YYYY-MM-DD)' })
  birthDate?: Date;

  @ApiProperty({ description: 'Role of the user', example: 'CLIENT', enum: $Enums.Role })
  @IsEnum($Enums.Role, { message: 'Rol no válido' })
  @IsNotEmpty()
  role: $Enums.Role;
}
