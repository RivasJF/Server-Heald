import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { $Enums } from 'generated/prisma';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'Nuevo nombre' })
  name?: string;

  @ApiPropertyOptional({ example: 'nuevo@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'newpassword123' })
  password?: string;

  @ApiPropertyOptional({
    example: 'CLIENT',
    enum: $Enums.Role,
  })
  role?: $Enums.Role;
}
