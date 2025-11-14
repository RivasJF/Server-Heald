import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService){}

  async getPrisma(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async deletePrisma(){
    return this.prisma.user.deleteMany();
  }
}
