import { Controller, Post, Param, Body, Get, Patch } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateDoctorScheduleDto } from './dto/create-schedule.dto';
import { UpdateDoctorScheduleDto } from './dto/update-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post(':id')
  async create(@Param('id') id: string, @Body() createScheduleDto: CreateDoctorScheduleDto) {
    return this.scheduleService.createSchedule(
      id,
      createScheduleDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.scheduleService.getScheduleByUserId(id);
  }

  @Patch(':id')
  async update( @Param('id') id: string, @Body() updateScheduleDto: UpdateDoctorScheduleDto,) {
    return this.scheduleService.updateSchedule(id, updateScheduleDto);
  }
}
