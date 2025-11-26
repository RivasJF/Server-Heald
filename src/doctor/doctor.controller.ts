import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from 'generated/prisma';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Doctors')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiOperation({ summary: 'Create a new doctor' })
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(createDoctorDto);
  }

  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({
      status: 200,
      description: 'List of doctors',
      type: [CreateDoctorDto],
    })
  @Get()
  findAll(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @ApiOperation({ summary: 'Get a doctor' })
  @ApiResponse({
      status: 200,
      description: 'Get doctor',
      type: CreateDoctorDto,
    })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Doctor> {
    return this.doctorService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a doctor' })
  @ApiResponse({
      status: 200,
      description: 'Update doctor',
      type: CreateDoctorDto,
    })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @ApiOperation({ summary: 'Delete a doctor' })
  @ApiResponse({
      status: 200,
      description: 'Delete doctor',
      type: CreateDoctorDto,
    })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Doctor> {
    return this.doctorService.remove(id);
  }
}
