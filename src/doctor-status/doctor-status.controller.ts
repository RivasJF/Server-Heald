import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Delete,
  Get,
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

  @Get(':doctorId/day-off')
  @ApiOperation({ summary: 'Get all day offs for a doctor' })
  async getAllDayOffs(@Param('doctorId') doctorId: string) {
    return this.doctorStatusService.getAllDayOffs(doctorId);
  }

  @Delete(':doctorId/day-off')
  @ApiOperation({ summary: 'Delete a day off for a doctor' })
  async deleteDayOff(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateDayOffDto,
  ) {
    return this.doctorStatusService.deleteDayOff(doctorId, dto);
  }

  @Post(':doctorId/daily-closure')
  @ApiOperation({ summary: 'Set a daily closure for a doctor' })
  async setDailyClosure(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateDayCloseDto,
  ) {
    return this.doctorStatusService.setDailyClosure(doctorId, dto);
  }

  @Delete(':doctorId/daily-closure')
  @ApiOperation({ summary: 'Delete a daily closure for a doctor' })
  async deleteDailyClosure(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateDayOffDto,
  ) {
    return this.doctorStatusService.deleteDailyClosure(doctorId, dto);
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
