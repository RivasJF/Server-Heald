import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDoctorDto } from './create-doctor.dto';

export class UpdateDoctorDto extends PartialType(OmitType(CreateDoctorDto, ['userId'] as const)) {
    @ApiPropertyOptional({ example: 'Nueava especialidad' })
    speciality?: string;
    
    @ApiPropertyOptional({ example: 'Nueva biografía' })
    biography?: string;

    @ApiPropertyOptional({ example: 30 })
    consultationTime?: number;
}
