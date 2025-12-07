import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { DoctorStatusService } from './doctor-status.service';
import { CreateDayOffDto } from './dto/create-day-off.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';
import { CreateDayCloseDto } from './dto/create-day-close';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Doctor-Status')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(AuthGuard('jwt'))
@Controller('doctor-status')
export class DoctorStatusController {
  constructor(private readonly doctorStatusService: DoctorStatusService) {}

  @Post(':doctorId/day-off')
  @ApiOperation({ summary: 'Set a day off for a doctor' })
  async setDayOff(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateDayOffDto,
  ) {
    return this.doctorStatusService.setDayOff(doctorId, dto);
  }

  @Post(':doctorId/daily-closure')
  @ApiOperation({ summary: 'Set a daily closure for a doctor' })
  async setDailyClosure(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateDayCloseDto,
  ) {
    return this.doctorStatusService.setDailyClosure(doctorId, dto);
  }

  @Patch(':doctorId/service-status')
  @ApiOperation({ summary: 'Set the service status for a doctor' })
  async setServiceStatus(
    @Param('doctorId') doctorId: string,
    @Body() dto: UpdateServiceStatusDto,
  ) {
    return this.doctorStatusService.setServiceStatus(doctorId, dto);
  }
}
