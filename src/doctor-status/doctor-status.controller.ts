import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { DoctorStatusService } from './doctor-status.service';
import { CreateDayOffDto } from './dto/create-day-off.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';
import { CreateDayCloseDto } from './dto/create-day-close';

@Controller('doctor-status')
export class DoctorStatusController {
  constructor(private readonly doctorStatusService: DoctorStatusService) {}

  // 1. Desactivar un día completo
  @Post(':doctorId/day-off')
  async setDayOff(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateDayOffDto,
  ) {
    return this.doctorStatusService.setDayOff(doctorId, dto);
  }

  // 2. Cierre anticipado de ese día
  @Post(':doctorId/daily-closure')
  async setDailyClosure(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateDayCloseDto,
  ) {
    return this.doctorStatusService.setDailyClosure(doctorId, dto);
  }

  // 3. Activar/desactivar servicio global
  @Patch(':doctorId/service-status')
  async setServiceStatus(
    @Param('doctorId') doctorId: string,
    @Body() dto: UpdateServiceStatusDto,
  ) {
    return this.doctorStatusService.setServiceStatus(doctorId, dto);
  }
}
