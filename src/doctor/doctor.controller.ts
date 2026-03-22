import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/doctorCreateRequest.dto';
import { UpdateDoctorDto } from './dto/doctorUpdateRequest.dto';
import { Doctor } from 'generated/prisma';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateDoctorUseCase } from './use-cases/create-doctor.use-case';
import { DoctorResponseDto } from './dto/doctorResponse.dto';
import { GetAllDoctorUseCase } from './use-cases/get-all-doctor.use-case';

@ApiTags('Doctors')
@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly createDoctorUseCase: CreateDoctorUseCase,
    private readonly getAllDoctorUseCase: GetAllDoctorUseCase
  ) {}

  @ApiOperation({ summary: 'Create a new doctor' })
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto): Promise<DoctorResponseDto> {
    return this.createDoctorUseCase.execute(createDoctorDto);
  }

  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({
      status: 200,
      description: 'List of doctors',
      type: [DoctorResponseDto],
    })
  @Get()
  findAll(): Promise<DoctorResponseDto[]> {
    return this.getAllDoctorUseCase.execute();
  }

  @ApiOperation({ summary: 'Get a doctor' })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
      status: 200,
      description: 'Get doctor',
      type: CreateDoctorDto,
    })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Doctor> {
    return this.doctorService.findOne(id);
  }

  @ApiOperation({ summary: 'Get a doctor by user ID' })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
    status: 200,
    description:
      'Get doctor profile by user ID. Returns a message if profile does not exist.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string): Promise<Doctor> {
    return this.doctorService.findByUserId(userId);
  }

  @ApiOperation({ summary: 'Update a doctor' })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
      status: 200,
      description: 'Update doctor',
      type: CreateDoctorDto,
    })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @ApiOperation({ summary: 'Delete a doctor' })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
      status: 200,
      description: 'Delete doctor',
      type: CreateDoctorDto,
    })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Doctor> {
    return this.doctorService.remove(id);
  }
}
