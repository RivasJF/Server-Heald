import { ApiProperty } from '@nestjs/swagger';

export class DoctorDayOffResponseDto {
  @ApiProperty({
    description: 'Identificador único del día libre',
    example: 'cm8z1xk2m0000s5u8n4p7q9r1',
  })
  readonly id: string;

  @ApiProperty({
    description: 'ID del doctor asociado',
    example: 'cm8z1xk2m0001s5u8j2h6t4v0',
  })
  readonly doctorId: string;

  @ApiProperty({
    description: 'Fecha del día libre en formato ISO',
    example: '2026-04-03T00:00:00.000Z',
  })
  readonly date: string;

  @ApiProperty({
    description: 'Fecha de creación en formato ISO',
    example: '2026-04-02T10:00:00.000Z',
  })
  readonly createdAt: string;

  constructor(data: Partial<DoctorDayOffResponseDto>) {
    Object.assign(this, data);
  }
}
