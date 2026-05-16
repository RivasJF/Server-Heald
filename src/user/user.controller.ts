import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/userUpdateRequest.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserResponseDto } from './dto/userResponse.dto';
import { GetAllUsersUseCase } from './use-cases/get-all-users.use-case';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { UserCreateDto } from './dto/userCreateRequest.dto';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { GetUserByIdUseCase } from './use-cases/get-user-by-id.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { GetAllUsersPaginationUseCase } from './use-cases/get-all-uses-pagination.use-case';
import { SendEmailVerificationUseCase } from './use-cases/send-email-verification.use-case';
import { VerificationCreateRequestDto } from './dto/verificationCreateRequest.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private readonly getAllUsersPaginationUseCase: GetAllUsersPaginationUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly sendEmailVerificationUseCase: SendEmailVerificationUseCase
  ) {}

  @ApiOperation({ summary: 'Send a code to verify email' })
  @ApiResponse({
    status: 200,
    description: 'Verification code sent'
  })
  @Post("send-code")
  sendCode(@Body() verificationCreateRequestDto: VerificationCreateRequestDto): Promise<{ message: string }> {
    return this.sendEmailVerificationUseCase.execute(verificationCreateRequestDto);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: UserResponseDto,
  })
  @Post()
  create(@Body() createUserDto: UserCreateDto): Promise<UserResponseDto>{
    return this.createUserUseCase.execute(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserResponseDto],
  })
  @Get()
  findAll(){
    return this.getAllUsersUseCase.execute();
  }

  @ApiOperation({ summary: 'Get all users pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserResponseDto],
  })
  @Get(':page/:pageSize')
  findAllPagination(@Param('page') page:number, @Param('pageSize') pageSize:number) {
    return this.getAllUsersPaginationUseCase.execute(page, pageSize);
  }

  @ApiOperation({ summary: 'Get a user' })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.getUserByIdUseCase.execute(id);
  }


  @ApiOperation({ summary: 'Update a user' })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    type: UserResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<UserResponseDto> {
    return this.deleteUserUseCase.execute(id);
  }
}
