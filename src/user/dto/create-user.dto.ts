import { IsString, IsNotEmpty, IsEnum, IsOptional, MinLength, IsEmail } from "class-validator";
import { $Enums } from "generated/prisma";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsOptional()
  @IsEnum($Enums.Role, { message: 'Rol no válido' })
  role: $Enums.Role;
}
