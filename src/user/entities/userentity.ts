import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from 'generated/prisma';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false})
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  phoneNumber: string | null;

  @ApiProperty({ required: false, nullable: true })
  birthDate: Date | null;

  @ApiProperty({ enum: $Enums.Role })
  role: $Enums.Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}