import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../entities/user.enum';

export class UserResponseDto {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: 'c9af1f20-9f6f-4e3e-9fb8-74d6e5f5e9e1',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@email.com',
  })
  readonly email: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del usuario',
    example: '+573001112233',
  })
  readonly phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento en formato ISO',
    example: '1998-05-14T00:00:00.000Z',
  })
  readonly birthDate?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: Role,
    example: Role.CLIENT,
  })
  readonly role: Role;

  @ApiProperty({
    description: 'Fecha de creación en formato ISO',
    example: '2026-03-30T14:30:00.000Z',
  })
  readonly createdAt: string;

  @ApiProperty({
    description: 'Fecha de última actualización en formato ISO',
    example: '2026-03-30T14:45:00.000Z',
  })
  readonly updatedAt: string;

  constructor(data: Partial<UserResponseDto>) {
    Object.assign(this, data);
  }
}