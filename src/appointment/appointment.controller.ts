import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FindAppointmentsByPatientUseCase } from './use-case/find-appointments-by-patient.use-case';
import { FindAppointmentsByDoctorUseCase } from './use-case/find-appointments-by-doctor.use-case';
import { GenerateAvailabilityUseCase } from './use-case/generate-availability.use-case';
import { CancelAppointmentUseCase } from './use-case/cancel-appointment.use-case';
import { CreateAppointmentUseCase } from './use-case/create-appointment.use-case';
import { AppointmentAvailabilityDto } from './dto/appointment-availability.dto';

@ApiTags('Appointment')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(AuthGuard('jwt'))
@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly findByPatientUseCase: FindAppointmentsByPatientUseCase,
    private readonly findByDoctorUseCase: FindAppointmentsByDoctorUseCase,
    private readonly generateAvailabilityUseCase: GenerateAvailabilityUseCase,
    private readonly cancelAppointmentUseCase: CancelAppointmentUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  create(@Body() dto: CreateAppointmentDto) {
    return this.createAppointmentUseCase.execute(dto);
    //return this.appointmentService.create(dto);
  }

  @Get('availability/:doctorId/:date')
  @ApiOperation({ summary: 'Get availability for a doctor on a specific day' })
  @ApiOkResponse({ type: AppointmentAvailabilityDto })
  getAvailability(
    @Param('doctorId') doctorId: string,
    @Param('date') date: string,
  ) {
    //return this.generateAvailabilityUseCase.execute(doctorId, date);
    return this.appointmentService.getAvailabilityForDay(doctorId, date);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Find appointments by doctor' })
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.findByDoctorUseCase.execute(doctorId);
    //return this.appointmentService.findByDoctor(doctorId);
  }

  @Get('patient/:patientId/:page/:pageSize')
  @ApiOperation({ summary: 'Find appointments by patient' })
  findByPatient(@Param('patientId') patientId: string,@Param('page') page:number, @Param('pageSize') pageSize:number) {
    return this.findByPatientUseCase.execute(patientId, page, pageSize );
    //return this.appointmentService.findByPatient(patientId);
  }

  @Delete(':appointmentId')
  @ApiOperation({ summary: 'Cancel an appointment' })
  cancelAppointment(@Param('appointmentId') appointmentId: string) {
    return this.cancelAppointmentUseCase.execute(appointmentId);
    //return this.appointmentService.cancelAppointment(appointmentId);
  }
}
