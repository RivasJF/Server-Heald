import { IsBoolean } from 'class-validator';

export class UpdateServiceStatusDto {
  @IsBoolean()
  active: boolean;
}
