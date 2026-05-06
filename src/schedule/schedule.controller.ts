import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CreateDoctorScheduleDto } from './dto/create-scheduleRequest.dto';
import { UpdateDoctorScheduleDto } from './dto/update-scheduleRequest.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetScheduleByUserIdUseCase } from './use-cases/get-schedule-by-user-id.use-case';
import { CreateScheduleUseCase } from './use-cases/create-schedule.use-case';
import { UpdateScheduleUseCase } from './use-cases/update-schedule.use-case';
import { ScheduleResponseDto } from './dto/scheduleResponse.dto';

@ApiTags('Schedules')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly getScheduleByUserIdUseCase: GetScheduleByUserIdUseCase,
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly updateScheduleUseCase: UpdateScheduleUseCase,
  ) {}

  @Post(':id')
  @ApiOperation({ summary: 'Create a new schedule for a doctor' })
  @ApiParam({ name: 'id', description: "Doctor's User ID" })
  @ApiBody({ type: CreateDoctorScheduleDto })
  @ApiResponse({
    status: 201,
    description: 'The schedule has been successfully created.',
    type: ScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  async create(
    @Param('id') id: string,
    @Body() createScheduleDto: CreateDoctorScheduleDto,
  ) {
    return this.createScheduleUseCase.execute(id, createScheduleDto);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get a doctor's schedule by user ID" })
  @ApiParam({ name: 'id', description: "Doctor's User ID" })
  @ApiResponse({ status: 200, description: 'The schedule.', type: ScheduleResponseDto })
  @ApiResponse({ status: 404, description: 'Schedule not found.' })
  async findOne(@Param('id') id: string) {
    return this.getScheduleByUserIdUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a doctor's schedule" })
  @ApiParam({ name: 'id', description: "Doctor's User ID" })
  @ApiBody({ type: UpdateDoctorScheduleDto })
  @ApiResponse({
    status: 200,
    description: 'The schedule has been successfully updated.',
    type: ScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Schedule not found.' })
  async update(
    @Param('id') doctorId: string,
    @Body() updateScheduleDto: UpdateDoctorScheduleDto,
  ) {
    return this.updateScheduleUseCase.execute(doctorId, updateScheduleDto);
  }
}
