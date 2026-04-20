import { IsArray, IsDateString, ValidateNested } from "class-validator";
import { AvailableSlotDto } from "./appointment-availability.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer/types/decorators/type.decorator";

export class AppointmentAvailabilityDto {
  @ApiProperty({ example: '2025-12-12' })
  @IsDateString()
  date: string;

  @ApiProperty({ type: [AvailableSlotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableSlotDto)
  available: AvailableSlotDto[];
}