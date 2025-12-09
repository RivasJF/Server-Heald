import { Controller, Post, Param, Body, Get, Patch, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateDoctorScheduleDto } from './dto/create-schedule.dto';
import { UpdateDoctorScheduleDto } from './dto/update-schedule.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Schedules')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post(':id')
  @ApiOperation({ summary: 'Create a new schedule for a doctor' })
  @ApiParam({ name: 'id', description: "Doctor's User ID" })
  @ApiBody({ type: CreateDoctorScheduleDto })
  @ApiResponse({ status: 201, description: 'The schedule has been successfully created.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  async create(@Param('id') id: string, @Body() createScheduleDto: CreateDoctorScheduleDto) {
    return this.scheduleService.createSchedule(
      id,
      createScheduleDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: "Get a doctor's schedule by user ID" })
  @ApiParam({ name: 'id', description: "Doctor's User ID" })
  @ApiResponse({ status: 200, description: 'The schedule.' })
  @ApiResponse({ status: 404, description: 'Schedule not found.' })
  async findOne(@Param('id') id: string) {
    return this.scheduleService.getScheduleByUserId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a doctor's schedule" })
  @ApiParam({ name: 'id', description: "Doctor's User ID" })
  @ApiBody({ type: UpdateDoctorScheduleDto })
  @ApiResponse({ status: 200, description: 'The schedule has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Schedule not found.' })
  async update( @Param('id') id: string, @Body() updateScheduleDto: UpdateDoctorScheduleDto,) {
    return this.scheduleService.updateSchedule(id, updateScheduleDto);
  }
}