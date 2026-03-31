import { ApiProperty } from '@nestjs/swagger';

export class DoctorServiceStatusResponseDto {
  @ApiProperty({
    description: 'Identificador único del estado de servicio',
    example: 'b2d6d5a9-2f6a-4d06-9f95-3f6c2f0df0a1',
  })
  readonly id: string;

  @ApiProperty({
    description: 'ID del doctor asociado',
    example: '7d3d8f87-9b23-4c47-b8ef-2f2f1b0a8d8e',
  })
  readonly doctorId: string;

  @ApiProperty({
    description: 'Indica si el doctor está activo para servicio',
    example: true,
  })
  readonly active: boolean;

  @ApiProperty({
    description: 'Fecha de última actualización en formato ISO',
    example: '2026-03-31T20:10:00.000Z',
  })
  readonly updatedAt: string;

  constructor(data: Partial<DoctorServiceStatusResponseDto>) {
    Object.assign(this, data);
  }
}