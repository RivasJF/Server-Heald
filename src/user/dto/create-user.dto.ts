import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsOptional, MinLength, IsEmail } from "class-validator";
import { $Enums } from "generated/prisma";

export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user', example: 'Chis' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email of the user', example: 'chis@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'strongpassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({ description: 'Role of the user', example: 'CLIENT', enum: $Enums.Role})
  @IsOptional()
  @IsEnum($Enums.Role, { message: 'Rol no válido' })
  role: $Enums.Role;
}
