import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger("Prisma")


  constructor() {
    const pool: any = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    
    super({ adapter }); // Pasamos el adaptador directamente
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
