import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { GetNearbyClinicsDto } from './dto/get-nearby-clinics.dto';
import { ClinicResponseDto } from './dto/clinicResponse.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FindAllClinicUseCase } from './use-case/find-all-clinic.use-case'
import { CreateClinicUseCase } from './use-case/create-clinic.use-case';
import { FindOneClinicUseCase } from './use-case/find-one-clinic.use-case';
import { UpdateClinicUseCase } from './use-case/update-clinic.use-case';
import { RemoveClinicUseCase } from './use-case/remove-clinic.use-case';
import { FindNearbyClinicUseCase } from './use-case/find-nearby-clinic.use-case';
import { ClinicService } from './clinic.service';

@ApiTags('Clinic')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('clinic')
export class ClinicController {
  constructor(
    private readonly findAllClinicUseCase: FindAllClinicUseCase,
    private readonly createClinicUseCase: CreateClinicUseCase,
    private readonly findOneClinicUseCase: FindOneClinicUseCase,
    private readonly updateClinicUseCase: UpdateClinicUseCase,
    private readonly removeClinicUseCase: RemoveClinicUseCase,
    private readonly findNearbyClinicUseCase: FindNearbyClinicUseCase,
    private readonly clinicService: ClinicService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clinic' })
  @ApiResponse({ status: 201, description: 'The clinic has been successfully created.', type: ClinicResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() dto: CreateClinicDto) {
    return this.createClinicUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clinics' })
  @ApiResponse({ status: 200, description: 'Return all clinics.', type: ClinicResponseDto, isArray: true })
  findAll() {
    return this.findAllClinicUseCase.execute();
  }

  @Post('near') // Cambiado a POST para recibir datos en el body
  @ApiOperation({ summary: 'Get nearby clinics' })
  @ApiResponse({ status: 200, description: 'Return nearby clinics.', type: ClinicResponseDto, isArray: true })
  async getNearbyClinics(@Body() body: GetNearbyClinicsDto) {
    const { lat, lng, radius = 5000 } = body; // Asignar valor por defecto si no se proporciona
    return this.clinicService.findNearby(lat, lng, radius);
    //return this.findNearbyClinicUseCase.execute(lat, lng, radius);
  }

  @Get(':doctorId')
  @ApiOperation({ summary: 'Get a clinic by doctorid' })
  @ApiResponse({ status: 200, description: 'Return a clinic by id.', type: ClinicResponseDto })
  @ApiResponse({ status: 404, description: 'Clinic not found.' })
  findOne(@Param('doctorId') doctorId: string) {
    return this.findOneClinicUseCase.execute(doctorId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a clinic' })
  @ApiResponse({ status: 200, description: 'The clinic has been successfully updated.', type: ClinicResponseDto })
  @ApiResponse({ status: 404, description: 'Clinic not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateClinicDto) {
    return this.updateClinicUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a clinic' })
  @ApiResponse({ status: 200, description: 'The clinic has been successfully deleted.', type: ClinicResponseDto })
  @ApiResponse({ status: 404, description: 'Clinic not found.' })
  remove(@Param('id') id: string) {
    return this.removeClinicUseCase.execute(id);
  }
}
