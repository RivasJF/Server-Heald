import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateServiceStatusDto {
  @ApiProperty({ example: 'true' })
  @IsBoolean()
  active: boolean;
}
