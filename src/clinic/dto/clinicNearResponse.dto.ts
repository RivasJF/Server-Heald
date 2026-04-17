import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { DoctorResponseDto } from 'src/doctor/dto/doctorResponse.dto';

export class ClinicNearResponseDto {
  @ApiProperty({
    description: "Clinic's unique identifier",
    example: 'cm8z1xk2m0000s5u8n4p7q9r1',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Clinic latitude coordinate',
    example: 4.711,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Clinic longitude coordinate',
    example: -74.0721,
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    description: 'Clinic address',
    example: 'Cra. 7 #123-45, Bogotá, Colombia',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'The doctor unique identifier associated with the clinic',
    example: 'cm8z1xk2m0001s5u8j2h6t4v0',
  })
  @IsUUID()
  doctorId: string;

  @ApiProperty({
    description: 'Clinic creation date',
    example: '2026-04-02T10:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Clinic last update date',
    example: '2026-04-02T12:00:00.000Z',
  })
  updatedAt: string;


  @ApiPropertyOptional({
    description: 'Associated doctor data for this clinic',
    type: () => DoctorResponseDto,
  })
  doctor?: DoctorResponseDto;
  
  @ApiPropertyOptional({
    description: 'Distance in meters from the search point',
    example: 1520.5,
  })
  @IsOptional()
  @IsNumber()
  distance?: number;

  constructor(data: Partial<ClinicNearResponseDto>) {
    Object.assign(this, data);
  }
}