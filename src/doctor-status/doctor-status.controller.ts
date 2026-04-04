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
import { CreateDayOffDto } from './dto/create-day-off.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';
import { CreateDayCloseDto } from './dto/create-day-close';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateDayOffUseCase } from './use-cases/create-day-off.use-case';
import { GetAllDayOffsUseCase } from './use-cases/get-all-day-offs.use-case';
import { DeleteDayOffUseCase } from './use-cases/delete-day-off.use-case';
import { CreateDayCloseUseCase } from './use-cases/create-day-close.use-case';
import { DeleteDayCloseUseCase } from './use-cases/delete-day-close.use-case';
import { SetServiceStatusUseCase } from './use-cases/set-service-status.use-case';

@ApiTags('Doctor-Status')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(AuthGuard('jwt'))
@Controller('doctor-status')
export class DoctorStatusController {
  constructor(
    private readonly createDayOffUseCase: CreateDayOffUseCase,
    private readonly getAllDayOffsUseCase: GetAllDayOffsUseCase,
    private readonly deleteDayOffUseCase: DeleteDayOffUseCase,
    private readonly createDayCloseUseCase: CreateDayCloseUseCase,
    private readonly deleteDayCloseUseCase: DeleteDayCloseUseCase,
    private readonly setServiceStatusUseCase: SetServiceStatusUseCase,
  ) {}

  @Post(':doctorId/day-off')
  @ApiOperation({ summary: 'Set a day off for a doctor' })
  async setDayOff(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateDayOffDto,
  ) {
    return this.createDayOffUseCase.execute(doctorId, dto);
  }

  @Get(':doctorId/day-off')
  @ApiOperation({ summary: 'Get all day offs for a doctor' })
  async getAllDayOffs(@Param('doctorId') doctorId: string) {
    return this.getAllDayOffsUseCase.execute(doctorId);
  }

  @Delete(':doctorId/day-off')
  @ApiOperation({ summary: 'Delete a day off for a doctor' })
  async deleteDayOff(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateDayOffDto,
  ) {
    return this.deleteDayOffUseCase.execute(doctorId, dto.date);
  }

  @Post(':doctorId/daily-closure')
  @ApiOperation({ summary: 'Set a daily closure for a doctor' })
  async setDailyClosure(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateDayCloseDto,
  ) {
    return this.createDayCloseUseCase.execute(doctorId, dto);
  }

  @Delete(':doctorId/daily-closure')
  @ApiOperation({ summary: 'Delete a daily closure for a doctor' })
  async deleteDailyClosure(
    @Param('doctorId') doctorId: string,
    @Body() dto: CreateDayOffDto,
  ) {
    return this.deleteDayCloseUseCase.execute(doctorId, dto);
  }

  @Patch(':doctorId/service-status')
  @ApiOperation({ summary: 'Set the service status for a doctor' })
  async setServiceStatus(
    @Param('doctorId') doctorId: string,
    @Body() dto: UpdateServiceStatusDto,
  ) {
    return this.setServiceStatusUseCase.execute(doctorId, dto);
  }
}
