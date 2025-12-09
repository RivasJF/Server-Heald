import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma'; // eslint-disable-line

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  excludePassword<TUser extends { password?: string }>(user: TUser): Omit<TUser, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: createUserDto });
    return this.excludePassword(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return this.excludePassword(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    const user = await this.prisma.user.update({ where: { id }, data: updateUserDto });
    return this.excludePassword(user);
  }

  async remove(id: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    const user = await this.prisma.user.delete({ where: { id } });
    return this.excludePassword(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    return user;
  }
}
