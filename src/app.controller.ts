import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPrisma(){
    return this.appService.getPrisma();
  }

  @Post()
  createPrisma(@Body('name') name: string){
    return this.appService.createPrisma(name);
  }

  @Delete()
  deletePrisma(){
    return this.appService.deletePrisma();
  }
}
