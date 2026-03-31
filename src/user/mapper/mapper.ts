import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/userResponse.dto';

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    return new UserResponseDto({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      phoneNumber: user.getPhoneNumber(),
      birthDate: user.getBirthDate()?.toISOString(),
      role: user.getRole(),
      createdAt: user.getCreatedAt()?.toISOString(),
      updatedAt: user.getUpdatedAt()?.toISOString(),
    });
  }
}
