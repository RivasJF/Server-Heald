import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger("Prisma")


  constructor() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("Database Connect")
    } catch (error) {
      this.logger.error("Not connection with Database", error)
      throw Error
    }
    
  }
  
  async onModuleDestroy(){
    try {
      await this.$disconnect();
      this.logger.log("Database Disconnect")
    } catch (error) {
      this.logger.error("Can not disconnection with Database")
    }
    
  }
}
