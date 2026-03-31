import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/userResponse.dto';
import { User as UserSchema } from 'generated/prisma';
import { Role } from "src/user/entities/user.enum";

export class UserMapper {

  static toDto(user: User): UserResponseDto {
    return new UserResponseDto({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      phoneNumber: user.getPhoneNumber() || null,
      birthDate: user.getBirthDate()?.toISOString() || null,
      role: user.getRole(),
      createdAt: user.getCreatedAt()?.toISOString(),
      updatedAt: user.getUpdatedAt()?.toISOString(),
    });
  }


  static toDomain(data: UserSchema) {
      const user = User.create(
        data.name,
        data.email,
        data.password,
        data.role as Role,
        data.phoneNumber === null ? undefined : data.phoneNumber,
        data.birthDate === null ? undefined : data.birthDate,
        data.id,
        data.createdAt,
        data.updatedAt,
      );
      return user;
}
  }
