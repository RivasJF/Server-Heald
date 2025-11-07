import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService){}

  async getPrisma(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createPrisma(name: string){
    return this.prisma.user.create({
      data: {
        name: name
      }
    })
  }

  async deletePrisma(){
    return this.prisma.user.deleteMany();
  }
}
