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
import { ResetPasswordUseCase } from './use-cases/reset-password.use-case';
import { ValidateCodePasswordResetUseCase } from './use-cases/validate-code-reset-password.use-case';
import { SendEmailPasswordResetUseCase } from './use-cases/send-email-password-reset.use-case';
import { CodeValidationRequestDto } from './dto/codeValidationRequest.dto';
import { ResetPasswordDto } from './dto/resetPasswordRequest.dto';

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
    private readonly sendEmailVerificationUseCase: SendEmailVerificationUseCase,
    private readonly sendEmailPasswordResetUseCase: SendEmailPasswordResetUseCase,
    private readonly validateCodePasswordResetUseCase: ValidateCodePasswordResetUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
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

  @ApiOperation({ summary: 'Send a code to reset password' })
  @ApiResponse({
    status: 200,
    description: 'Verification code sent'
  })
  @Post("send-code-reset-password")
  sendEmailCode(@Body() verificationCreateRequestDto: VerificationCreateRequestDto): Promise<{ message: string }> {
    return this.sendEmailPasswordResetUseCase.execute(verificationCreateRequestDto);
  }

  @ApiOperation({ summary: 'Validate the reset password code' })
  @ApiResponse({
    status: 200,
    description: 'Code is valid'
  })
  @Post("validate-code-reset-password")
  validateCodeResetPassword(@Body() codeValidationRequestDto: CodeValidationRequestDto): Promise<{ message: string }> {
    return this.validateCodePasswordResetUseCase.execute(codeValidationRequestDto);
  }

  @ApiOperation({ summary: 'Reset the user password' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully'
  })
  @Patch("reset-password")
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    return this.resetPasswordUseCase.execute(resetPasswordDto);
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
