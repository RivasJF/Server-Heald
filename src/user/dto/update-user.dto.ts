import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsDate,
	IsEmail,
	IsEnum,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MinLength,
} from 'class-validator';

export class UpdateUserDto {
	@ApiPropertyOptional({
		description: 'Name of the user',
		example: 'Chis',
	})
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({
		description: 'Email of the user',
		example: 'chis@example.com',
	})
	@IsOptional()
	@IsEmail()
	@Transform(({ value }) => value?.toLowerCase())
	email?: string;

	@ApiPropertyOptional({
		description: 'Password of the user',
		example: 'strongpassword123',
	})
	@IsOptional()
	@IsString()
	@MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
	password?: string;

	@ApiPropertyOptional({
		description: 'Phone number of the user in E.164 format',
		example: '+12133734253',
	})
	@IsOptional()
	@IsPhoneNumber(undefined, {
		message:
			'El número de teléfono debe ser un número de teléfono válido en formato E.164',
	})
	phoneNumber?: string;
}
