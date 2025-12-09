import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Clinic')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('clinic')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clinic' })
  @ApiResponse({ status: 201, description: 'The clinic has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() dto: CreateClinicDto) {
    return this.clinicService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clinics' })
  @ApiResponse({ status: 200, description: 'Return all clinics.' })
  findAll() {
    return this.clinicService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a clinic by id' })
  @ApiResponse({ status: 200, description: 'Return a clinic by id.' })
  @ApiResponse({ status: 404, description: 'Clinic not found.' })
  findOne(@Param('id') id: string) {
    return this.clinicService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a clinic' })
  @ApiResponse({ status: 200, description: 'The clinic has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Clinic not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateClinicDto) {
    return this.clinicService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a clinic' })
  @ApiResponse({ status: 200, description: 'The clinic has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Clinic not found.' })
  remove(@Param('id') id: string) {
    return this.clinicService.remove(id);
  }
}
