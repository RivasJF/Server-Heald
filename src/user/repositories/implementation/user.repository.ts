import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../user.repository.imp';
import { User } from '../../entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as UserSchema } from 'generated/prisma';
import { Role } from '../../entities/user.enum';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }
    return this.toDomain(user);
  }

  async fiendAllPagination(page: number, pageSize: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
     skip: (page - 1) * pageSize,
     take: pageSize,
     orderBy: {
       createdAt: 'desc',
     },
    });
    return users.map((user) => this.toDomain(user));
  }

  async fiendAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
     orderBy: {
       createdAt: 'desc',
     },
    });
    return users.map((user) => this.toDomain(user));
  }

  async delete(id: string): Promise<User | null> {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return null;
    return this.toDomain(user);
  }

  async save(entity: User): Promise<User> {
    if (!entity.getId()) {
      const user = await this.prisma.user.create({
        data: {
          name: entity.getName(),
          email: entity.getEmail(),
          password: entity.getPassword(),
          role: entity.getRole(),
          phoneNumber: entity.getPhoneNumber(),
          birthDate: entity.getBirthDate(),
        },
      });
      return this.toDomain(user);
    } else {
      const user = await this.prisma.user.update({
        where: {
          id: entity.getId(),
        },
        data: {
          name: entity.getName(),
          email: entity.getEmail(),
          password: entity.getPassword(),
          phoneNumber: entity.getPhoneNumber(),
          birthDate: entity.getBirthDate(),
        },
      });
      return this.toDomain(user);
    }
  }

  private toDomain(data: UserSchema) {
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
