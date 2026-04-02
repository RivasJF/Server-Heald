import { ApiProperty } from '@nestjs/swagger';

export class ClinicResponseDto {
  @ApiProperty({ example: 'cm8z1xk2m0000s5u8n4p7q9r1' })
  id: string;

  @ApiProperty({ example: 4.711, description: 'Clinic latitude coordinate' })
  latitude: number;

  @ApiProperty({ example: -74.0721, description: 'Clinic longitude coordinate' })
  longitude: number;

  @ApiProperty({ example: 'Cra. 7 #123-45, Bogotá, Colombia' })
  address: string;

  @ApiProperty({ example: 'cm8z1xk2m0001s5u8j2h6t4v0' })
  doctorId: string;

  @ApiProperty({ example: '2026-04-02T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-02T12:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: 1520.5, required: false, description: 'Distance in meters from the search point' })
  distance?: number;

  constructor(data: Partial<ClinicResponseDto>) {
    Object.assign(this, data);
  }
}
