import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';
import { UserEntity } from './entities/user.entity';

const userSelect = {
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
  birthDate: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.prisma.user.create({
      data: createUserDto,
      select: userSelect,
    });
  }

  async findAll(): Promise<ReadonlyArray<UserEntity>> {
    return await this.prisma.user.findMany({ select: userSelect });
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: userSelect,
      });
    } catch {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
  }

  async remove(id: string): Promise<UserEntity> {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: userSelect,
      });
    } catch {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
  }

  // service to login => (Internal) || service to public API !=/Internal/ 
  async findByEmailInternal(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    return user;
  }
}
