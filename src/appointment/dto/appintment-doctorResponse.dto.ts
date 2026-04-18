import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClinicResponseDto } from 'src/clinic/dto/clinicResponse.dto';
import { UserResponseDto } from 'src/user/dto/userResponse.dto';

export class AppointmentDoctorResponseDto {
  @ApiProperty({ example: 'cm8z1xk2m0000s5u8n4p7q9r1' })
  id: string;

  @ApiProperty({ example: 'cm8z1xk2m0001s5u8j2h6t4v0' })
  doctorId: string;

  @ApiProperty({ example: 'cm8z1xk2m0002s5u8b3n5m7k4' })
  patientId: string;

  @ApiProperty({ example: 'cm8z1xk2m0003s5u8f1d9w6y2' })
  clinicLocationId: string;

  @ApiProperty({ example: '2026-04-03T10:00:00.000Z' })
  startTime: Date;

  @ApiProperty({ example: '2026-04-03T10:30:00.000Z' })
  endTime: Date;

  @ApiProperty({ example: '2026-04-02T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-03T08:30:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ type: UserResponseDto })
  patient?: UserResponseDto;

  @ApiPropertyOptional({ type: ClinicResponseDto })
  clinicLocation?: ClinicResponseDto;

  constructor(data: Partial<AppointmentDoctorResponseDto>) {
    Object.assign(this, data);
  }
}