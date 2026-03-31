import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateDoctorDto } from './dto/doctorCreateRequest.dto';
import { UpdateDoctorDto } from './dto/doctorUpdateRequest.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateDoctorUseCase } from './use-cases/create-doctor.use-case';
import { DoctorResponseDto } from './dto/doctorResponse.dto';
import { GetAllDoctorUseCase } from './use-cases/get-all-doctor.use-case';
import { GetDoctorByIdUseCase } from './use-cases/get-doctor-by-id.use-case';
import { GetDoctorByUserIdUseCase } from './use-cases/get-doctor-by-user-id.use-case';
import { UpdateDoctorUseCase } from './use-cases/update-doctor.use-case';
import { DeleteDoctorUseCase } from './use-cases/delete-doctor.use-case';

@ApiTags('Doctors')
@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly createDoctorUseCase: CreateDoctorUseCase,
    private readonly getAllDoctorUseCase: GetAllDoctorUseCase,
    private readonly getDoctorByIdUseCase: GetDoctorByIdUseCase,
    private readonly getDoctorByUserIdUseCase: GetDoctorByUserIdUseCase,
    private readonly updateDoctorUseCase: UpdateDoctorUseCase,
    private readonly deleteDoctorUseCase: DeleteDoctorUseCase,
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
      type: DoctorResponseDto,
    })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<DoctorResponseDto> {
    return this.getDoctorByIdUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Get a doctor by user ID' })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
    status: 200,
    description:
      'Get doctor profile by user ID. Returns a message if profile does not exist.',
    type: DoctorResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string): Promise<DoctorResponseDto> {
    return this.getDoctorByUserIdUseCase.execute(userId);
  }

  @ApiOperation({ summary: 'Update a doctor' })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
      status: 200,
      description: 'Update doctor',
      type: DoctorResponseDto,
    })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto): Promise<DoctorResponseDto> {
    return this.updateDoctorUseCase.execute(id, updateDoctorDto);
  }

  @ApiOperation({ summary: 'Delete a doctor' })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
      status: 200,
      description: 'Delete doctor',
      type: DoctorResponseDto,
    })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DoctorResponseDto> {
    return this.deleteDoctorUseCase.execute(id);
  }
}
