import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Appointment')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(AuthGuard('jwt'))
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  @Get('availability/:doctorId/:date')
  @ApiOperation({ summary: 'Get availability for a doctor on a specific day' })
  getAvailability(
    @Param('doctorId') doctorId: string,
    @Param('date') date: string,
  ) {
    return this.appointmentService.getAvailabilityForDay(doctorId, date);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Find appointments by doctor' })
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.appointmentService.findByDoctor(doctorId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Find appointments by patient' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.appointmentService.findByPatient(patientId);
  }
}
