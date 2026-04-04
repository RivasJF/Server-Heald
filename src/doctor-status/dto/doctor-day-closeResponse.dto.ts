import { ApiProperty } from '@nestjs/swagger';

export class DoctorDayCloseResponseDto {
  @ApiProperty({
    description: 'Identificador único del cierre anticipado',
    example: 'cm8z1xk2m0000s5u8n4p7q9r1',
  })
  readonly id: string;

  @ApiProperty({
    description: 'ID del doctor asociado',
    example: 'cm8z1xk2m0001s5u8j2h6t4v0',
  })
  readonly doctorId: string;

  @ApiProperty({
    description: 'Fecha del cierre anticipado en formato ISO',
    example: '2026-04-03T00:00:00.000Z',
  })
  readonly date: string;

  @ApiProperty({
    description: 'Hora de cierre anticipado en formato HH:mm',
    example: '14:30',
  })
  readonly closedAt: string;

  @ApiProperty({
    description: 'Fecha de creación en formato ISO',
    example: '2026-04-02T10:00:00.000Z',
  })
  readonly createdAt: string;

  constructor(data: Partial<DoctorDayCloseResponseDto>) {
    Object.assign(this, data);
  }
}
