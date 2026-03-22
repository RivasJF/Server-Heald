import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDoctorDto } from './doctorCreateRequest.dto';

export class UpdateDoctorDto extends PartialType(OmitType(CreateDoctorDto, ['userId'] as const)) {
    @ApiPropertyOptional({ example: 'Nueava especialidad' })
    speciality?: string;
    
    @ApiPropertyOptional({ example: 'Nueva biografía' })
    biography?: string;
}
